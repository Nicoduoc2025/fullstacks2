package cl.sonidovivo.usuarios.dto;

import jakarta.validation.constraints.NotBlank;

public record SolicitudRenovacionToken(@NotBlank String tokenRenovacion) {
}
