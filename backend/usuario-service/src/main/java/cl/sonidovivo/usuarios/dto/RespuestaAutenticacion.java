package cl.sonidovivo.usuarios.dto;

public record RespuestaAutenticacion(
        String tokenAcceso,
        String tokenRenovacion,
        UsuarioResponse usuario) {
}
