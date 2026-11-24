package cl.sonidovivo.productos.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.*;

public record ProductoRequest(
        @NotBlank @Size(max = 20) String codigo,
        @NotBlank @Size(max = 80) String categoria,
        @NotBlank @Size(max = 120) String nombre,
        @NotBlank @Size(max = 80) String marca,
        @NotBlank @Size(max = 80) String modelo,
        @NotNull @Min(0) Integer stock,
        @NotNull @DecimalMin("0.0") BigDecimal precio,
        @NotBlank @Size(max = 255) String imagen,
        Boolean activo) {
}
