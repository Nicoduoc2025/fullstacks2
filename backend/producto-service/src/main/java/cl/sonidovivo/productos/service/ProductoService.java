package cl.sonidovivo.productos.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.productos.dto.*;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.ProductoRepository;

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listar() {
        return repository.findAll().stream().map(this::aResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse buscarPorCodigo(String codigo) {
        return aResponse(buscarEntidad(codigo));
    }

    @Transactional(readOnly = true)
    public Producto buscarEntidad(String codigo) {
        return repository.findByCodigoIgnoreCase(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado."));
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        String codigo = request.codigo().trim().toUpperCase();
        if (repository.existsByCodigoIgnoreCase(codigo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con ese código.");
        }

        Producto producto = new Producto();
        aplicar(producto, request, codigo);
        return aResponse(repository.save(producto));
    }

    @Transactional
    public ProductoResponse actualizar(String codigo, ProductoRequest request) {
        Producto producto = buscarEntidad(codigo);
        aplicar(producto, request, producto.getCodigo());
        return aResponse(repository.save(producto));
    }

    @Transactional
    public ProductoResponse sumarStock(String codigo, int cantidad) {
        Producto producto = buscarEntidad(codigo);
        producto.setStock(producto.getStock() + cantidad);
        return aResponse(repository.save(producto));
    }

    @Transactional
    public ProductoResponse descontarStock(String codigo, int cantidad) {
        Producto producto = buscarEntidad(codigo);
        if (!Boolean.TRUE.equals(producto.getActivo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El producto está inactivo.");
        }
        if (cantidad < 1 || producto.getStock() < cantidad) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente para " + producto.getCodigo() + ".");
        }
        producto.setStock(producto.getStock() - cantidad);
        return aResponse(repository.save(producto));
    }

    @Transactional
    public void eliminar(String codigo) {
        repository.delete(buscarEntidad(codigo));
    }

    public ProductoResponse aResponse(Producto p) {
        return new ProductoResponse(
                p.getId(), p.getCodigo(), p.getCategoria(), p.getNombre(), p.getMarca(),
                p.getModelo(), p.getStock(), p.getPrecio(), p.getImagen(), p.getActivo());
    }

    private void aplicar(Producto p, ProductoRequest r, String codigo) {
        p.setCodigo(codigo);
        p.setCategoria(r.categoria().trim());
        p.setNombre(r.nombre().trim());
        p.setMarca(r.marca().trim());
        p.setModelo(r.modelo().trim());
        p.setStock(r.stock());
        p.setPrecio(r.precio());
        p.setImagen(r.imagen().trim());
        p.setActivo(r.activo() == null ? true : r.activo());
    }
}
