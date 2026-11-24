package cl.sonidovivo.productos.controller;

import java.util.List;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import cl.sonidovivo.productos.dto.*;
import cl.sonidovivo.productos.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService servicio;

    public ProductoController(ProductoService servicio) {
        this.servicio = servicio;
    }

    @Operation(summary = "Listar productos")
    @GetMapping
    public List<ProductoResponse> listar() {
        return servicio.listar();
    }

    @Operation(summary = "Buscar producto por código")
    @GetMapping("/codigo/{codigo}")
    public ProductoResponse buscarPorCodigo(@PathVariable String codigo) {
        return servicio.buscarPorCodigo(codigo);
    }

    @Operation(summary = "Crear producto")
    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest solicitud) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(solicitud));
    }

    @Operation(summary = "Actualizar producto")
    @PutMapping("/{codigo}")
    public ProductoResponse actualizar(@PathVariable String codigo, @Valid @RequestBody ProductoRequest solicitud) {
        return servicio.actualizar(codigo, solicitud);
    }

    @Operation(summary = "Reabastecer stock")
    @PatchMapping("/{codigo}/stock")
    public ProductoResponse sumarStock(@PathVariable String codigo, @Valid @RequestBody StockRequest solicitud) {
        return servicio.sumarStock(codigo, solicitud.cantidad());
    }

    @Operation(summary = "Eliminar producto")
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> eliminar(@PathVariable String codigo) {
        servicio.eliminar(codigo);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Descontar stock desde el microservicio de pedidos")
    @PostMapping("/interno/{codigo}/descontar")
    public ProductoResponse descontarStock(
            @PathVariable String codigo,
            @Valid @RequestBody StockRequest solicitud) {
        return servicio.descontarStock(codigo, solicitud.cantidad());
    }
}
