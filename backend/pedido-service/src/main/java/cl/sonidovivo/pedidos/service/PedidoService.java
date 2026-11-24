package cl.sonidovivo.pedidos.service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.pedidos.client.*;
import cl.sonidovivo.pedidos.dto.*;
import cl.sonidovivo.pedidos.model.*;
import cl.sonidovivo.pedidos.repository.PedidoRepository;

@Service
public class PedidoService {

    private final PedidoRepository repositorio;
    private final ProductoClient clienteProductos;
    private final UsuarioClient clienteUsuarios;
    private final NotificacionClient clienteNotificaciones;

    public PedidoService(PedidoRepository repositorio, ProductoClient clienteProductos,
            UsuarioClient clienteUsuarios, NotificacionClient clienteNotificaciones) {
        this.repositorio = repositorio;
        this.clienteProductos = clienteProductos;
        this.clienteUsuarios = clienteUsuarios;
        this.clienteNotificaciones = clienteNotificaciones;
    }

    @Transactional
    public PedidoResponse crear(CrearPedidoRequest solicitud) {
        UsuarioInternoResponse usuario = clienteUsuarios.buscarInterno(solicitud.usuarioId());
        if (usuario == null || !usuario.activo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El usuario no está habilitado para comprar.");
        }

        Map<String, Integer> cantidades = new LinkedHashMap<>();
        for (ItemPedidoRequest item : solicitud.items()) {
            String codigo = item.productoCodigo().trim().toUpperCase();
            cantidades.merge(codigo, item.cantidad(), Integer::sum);
        }

        List<ProductoExternoResponse> productos = new ArrayList<>();
        for (var entrada : cantidades.entrySet()) {
            ProductoExternoResponse producto;
            try {
                producto = clienteProductos.buscarPorCodigo(entrada.getKey());
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Producto no disponible: " + entrada.getKey());
            }

            if (!Boolean.TRUE.equals(producto.activo()) || producto.stock() < entrada.getValue()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Stock insuficiente para " + entrada.getKey() + ".");
            }
            productos.add(producto);
        }

        for (ProductoExternoResponse producto : productos) {
            clienteProductos.descontarStock(
                    producto.codigo(),
                    new StockRequest(cantidades.get(producto.codigo().toUpperCase())));
        }

        Pedido pedido = new Pedido();
        pedido.setCodigoPedido(generarCodigo());
        pedido.setUsuarioId(solicitud.usuarioId());
        pedido.setEstado(EstadoPedido.CONFIRMADO);

        BigDecimal total = BigDecimal.ZERO;
        for (ProductoExternoResponse producto : productos) {
            int cantidad = cantidades.get(producto.codigo().toUpperCase());
            BigDecimal subtotal = producto.precio().multiply(BigDecimal.valueOf(cantidad));

            DetallePedido detalle = new DetallePedido();
            detalle.setProductoCodigo(producto.codigo());
            detalle.setProductoNombre(producto.nombre());
            detalle.setCantidad(cantidad);
            detalle.setPrecioUnitario(producto.precio());
            detalle.setSubtotal(subtotal);
            pedido.agregarDetalle(detalle);
            total = total.add(subtotal);
        }

        pedido.setTotal(total);
        Pedido guardado = repositorio.save(pedido);

        notificar(guardado,
                "Pedido confirmado",
                "Tu pedido " + guardado.getCodigoPedido() + " fue registrado correctamente.");

        return aResponse(guardado);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPorUsuario(Long usuarioId) {
        return repositorio.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId)
                .stream().map(this::aResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos() {
        return repositorio.findAllByOrderByFechaCreacionDesc()
                .stream().map(this::aResponse).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarCodigo(String codigo) {
        Pedido pedido = repositorio.findByCodigoPedidoIgnoreCase(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));
        return aResponse(pedido);
    }

    @Transactional
    public PedidoResponse actualizarEstado(Long id, EstadoPedidoRequest solicitud) {
        Pedido pedido = repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));

        EstadoPedido estado;
        try {
            estado = EstadoPedido.valueOf(solicitud.estado().trim().toUpperCase());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado de pedido inválido.");
        }

        pedido.setEstado(estado);
        Pedido guardado = repositorio.save(pedido);
        notificar(guardado,
                "Estado de pedido actualizado",
                "El pedido " + guardado.getCodigoPedido() + " ahora está "
                        + estado.name().replace('_', ' ') + ".");
        return aResponse(guardado);
    }

    @Transactional
    public void eliminar(Long id) {
        Pedido pedido = repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));
        repositorio.delete(pedido);
    }

    private void notificar(Pedido pedido, String titulo, String mensaje) {
        try {
            clienteNotificaciones.crear(new NotificacionCreateRequest(
                    pedido.getUsuarioId(), pedido.getId(), "PEDIDO", titulo, mensaje));
        } catch (Exception ignored) {
            // Un fallo temporal de notificaciones no anula el pedido.
        }
    }

    private String generarCodigo() {
        return "SV-" + UUID.randomUUID().toString().replace("-", "")
                .substring(0, 8).toUpperCase();
    }

    private PedidoResponse aResponse(Pedido pedido) {
        List<DetallePedidoResponse> detalles = pedido.getDetalles().stream()
                .map(detalle -> new DetallePedidoResponse(
                        detalle.getId(),
                        detalle.getProductoCodigo(),
                        detalle.getProductoNombre(),
                        detalle.getCantidad(),
                        detalle.getPrecioUnitario(),
                        detalle.getSubtotal()))
                .collect(Collectors.toList());

        return new PedidoResponse(
                pedido.getId(),
                pedido.getCodigoPedido(),
                pedido.getUsuarioId(),
                pedido.getFechaCreacion(),
                pedido.getEstado().name(),
                pedido.getTotal(),
                detalles);
    }
}
