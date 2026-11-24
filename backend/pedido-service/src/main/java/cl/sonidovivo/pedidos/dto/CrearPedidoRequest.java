package cl.sonidovivo.pedidos.dto;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CrearPedidoRequest(
        @NotNull Long usuarioId,
        @NotEmpty List<@Valid ItemPedidoRequest> items) {
}
