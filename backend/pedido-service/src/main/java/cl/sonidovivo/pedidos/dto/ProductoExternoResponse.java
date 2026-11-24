package cl.sonidovivo.pedidos.dto;

import java.math.BigDecimal;

public record ProductoExternoResponse(
        Long id,
        String codigo,
        String categoria,
        String nombre,
        String marca,
        String modelo,
        Integer stock,
        BigDecimal precio,
        String imagen,
        Boolean activo) {
}
