package cl.sonidovivo.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioUpdateRequest(
        @NotBlank @Size(max = 80) String nombreUsuario,
        @NotBlank @Email @Size(max = 120) String correo,
        @Size(min = 6, max = 72) String contrasena,
        @NotBlank String rol,
        @NotBlank String estado) {
}
