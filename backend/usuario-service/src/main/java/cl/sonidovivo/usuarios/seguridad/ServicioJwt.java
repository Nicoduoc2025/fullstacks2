package cl.sonidovivo.usuarios.seguridad;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import cl.sonidovivo.usuarios.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class ServicioJwt {

    private final SecretKey clave;
    private final long minutosAcceso;
    private final long diasRenovacion;

    public ServicioJwt(
            @Value("${seguridad.jwt.secreto}") String secreto,
            @Value("${seguridad.jwt.expiracion-minutos:30}") long minutosAcceso,
            @Value("${seguridad.jwt.renovacion-dias:7}") long diasRenovacion) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.minutosAcceso = minutosAcceso;
        this.diasRenovacion = diasRenovacion;
    }

    public String crearTokenAcceso(Usuario usuario) {
        return crearToken(usuario, "acceso", Instant.now().plus(minutosAcceso, ChronoUnit.MINUTES));
    }

    public String crearTokenRenovacion(Usuario usuario) {
        return crearToken(usuario, "renovacion", Instant.now().plus(diasRenovacion, ChronoUnit.DAYS));
    }

    public Claims validarTokenAcceso(String token) {
        return validar(token, "acceso");
    }

    public Claims validarTokenRenovacion(String token) {
        return validar(token, "renovacion");
    }

    private String crearToken(Usuario usuario, String tipo, Instant vencimiento) {
        Instant ahora = Instant.now();
        return Jwts.builder()
                .subject(usuario.getCorreo())
                .claim("usuarioId", usuario.getId())
                .claim("rol", usuario.getRol().name())
                .claim("tipo", tipo)
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(vencimiento))
                .signWith(clave)
                .compact();
    }

    private Claims validar(String token, String tipoEsperado) {
        Claims claims = Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String tipo = claims.get("tipo", String.class);
        if (!tipoEsperado.equals(tipo)) {
            throw new IllegalArgumentException("Tipo de token inválido.");
        }
        return claims;
    }
}
