package cl.sonidovivo.pedidos.dto;

import jakarta.validation.constraints.NotBlank;

public record EstadoPedidoRequest(@NotBlank String estado) {
}
