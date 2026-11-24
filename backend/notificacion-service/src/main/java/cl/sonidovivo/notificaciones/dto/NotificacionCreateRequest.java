package cl.sonidovivo.notificaciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NotificacionCreateRequest(
        @NotNull Long usuarioId,
        Long pedidoId,
        @NotBlank String tipo,
        @NotBlank @Size(max = 120) String titulo,
        @NotBlank @Size(max = 500) String mensaje) {
}
