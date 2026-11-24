package cl.sonidovivo.pedidos.client;

import cl.sonidovivo.pedidos.dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "producto-service")
public interface ProductoClient {

    @GetMapping("/api/productos/codigo/{codigo}")
    ProductoExternoResponse buscarPorCodigo(@PathVariable("codigo") String codigo);

    @PostMapping("/api/productos/interno/{codigo}/descontar")
    ProductoExternoResponse descontarStock(
            @PathVariable("codigo") String codigo,
            @RequestBody StockRequest request);
}
