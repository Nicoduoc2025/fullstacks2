package cl.sonidovivo.pedidos.dto;
public record NotificacionCreateRequest(
        Long usuarioId,
        Long pedidoId,
        String tipo,
        String titulo,
        String mensaje) {
}
