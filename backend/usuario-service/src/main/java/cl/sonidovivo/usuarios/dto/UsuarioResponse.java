package cl.sonidovivo.usuarios.dto;

public record UsuarioResponse(
        Long id,
        String nombreUsuario,
        String correo,
        String rol,
        String estado) {
}
