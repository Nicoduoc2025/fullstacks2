package cl.sonidovivo.pedidos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ItemPedidoRequest(
        @NotBlank String productoCodigo,
        @Min(1) int cantidad) {
}
