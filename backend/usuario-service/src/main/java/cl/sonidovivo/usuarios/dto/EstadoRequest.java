package cl.sonidovivo.usuarios.dto;

import jakarta.validation.constraints.NotBlank;

public record EstadoRequest(@NotBlank String estado) {
}
