package cl.sonidovivo.pedidos.controller;

import java.util.List;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import cl.sonidovivo.pedidos.dto.*;
import cl.sonidovivo.pedidos.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService servicio;

    public PedidoController(PedidoService servicio) {
        this.servicio = servicio;
    }

    @Operation(summary = "Crear pedido")
    @PostMapping
    public ResponseEntity<PedidoResponse> crear(@Valid @RequestBody CrearPedidoRequest solicitud) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(solicitud));
    }

    @Operation(summary = "Listar pedidos de un usuario")
    @GetMapping("/usuario/{usuarioId}")
    public List<PedidoResponse> listarPorUsuario(@PathVariable Long usuarioId) {
        return servicio.listarPorUsuario(usuarioId);
    }

    @Operation(summary = "Buscar pedido por código")
    @GetMapping("/codigo/{codigo}")
    public PedidoResponse buscarCodigo(@PathVariable String codigo) {
        return servicio.buscarCodigo(codigo);
    }

    @Operation(summary = "Listar todos los pedidos")
    @GetMapping
    public List<PedidoResponse> listarTodos() {
        return servicio.listarTodos();
    }

    @Operation(summary = "Actualizar estado del pedido")
    @PutMapping("/{id}/estado")
    public PedidoResponse actualizarEstado(
            @PathVariable Long id,
            @Valid @RequestBody EstadoPedidoRequest solicitud) {
        return servicio.actualizarEstado(id, solicitud);
    }

    @Operation(summary = "Eliminar pedido")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
