package cl.sonidovivo.notificaciones.dto;

import java.time.LocalDateTime;

public record NotificacionResponse(
        Long id,
        Long usuarioId,
        Long pedidoId,
        String tipo,
        String titulo,
        String mensaje,
        boolean leida,
        LocalDateTime fechaCreacion) {
}
