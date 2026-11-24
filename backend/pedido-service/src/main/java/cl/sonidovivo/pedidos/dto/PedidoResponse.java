package cl.sonidovivo.pedidos.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        String codigoPedido,
        Long usuarioId,
        LocalDateTime fechaCreacion,
        String estado,
        BigDecimal total,
        List<DetallePedidoResponse> detalles) {
}
