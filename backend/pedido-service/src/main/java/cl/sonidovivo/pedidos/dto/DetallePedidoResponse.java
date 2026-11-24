package cl.sonidovivo.pedidos.dto;

import java.math.BigDecimal;

public record DetallePedidoResponse(
        Long id,
        String productoCodigo,
        String productoNombre,
        int cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal) {
}
