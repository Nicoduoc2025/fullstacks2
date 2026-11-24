package cl.sonidovivo.usuarios.dto;

public record UsuarioInternoResponse(
        Long id,
        String nombreUsuario,
        String correo,
        String rol,
        String estado,
        boolean activo) {
}
