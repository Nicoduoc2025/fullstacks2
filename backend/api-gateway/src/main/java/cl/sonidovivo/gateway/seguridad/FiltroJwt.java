package cl.sonidovivo.gateway.seguridad;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
public class FiltroJwt extends OncePerRequestFilter {

    private static final Set<String> ROLES_GESTION = Set.of("ADMIN", "VENDEDOR");
    private final SecretKey clave;

    public FiltroJwt(@Value("${seguridad.jwt.secreto}") String secreto) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || esRutaPublica(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String autorizacion = request.getHeader("Authorization");
        if (autorizacion == null || !autorizacion.startsWith("Bearer ")) {
            responder(request, response, HttpServletResponse.SC_UNAUTHORIZED,
                    "Debes iniciar sesión para acceder a este recurso.");
            return;
        }

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(clave)
                    .build()
                    .parseSignedClaims(autorizacion.substring(7))
                    .getPayload();

            if (!"acceso".equals(claims.get("tipo", String.class))) {
                responder(request, response, HttpServletResponse.SC_UNAUTHORIZED, "El token enviado no es de acceso.");
                return;
            }

            Number id = claims.get("usuarioId", Number.class);
            String rol = claims.get("rol", String.class);
            if (id == null || rol == null) {
                responder(request, response, HttpServletResponse.SC_UNAUTHORIZED, "El token no contiene los datos necesarios.");
                return;
            }

            if (!puedeAcceder(request, id.longValue(), rol)) {
                responder(request, response, HttpServletResponse.SC_FORBIDDEN,
                        "Tu rol no tiene permiso para realizar esta acción.");
                return;
            }

            filterChain.doFilter(request, response);
        } catch (JwtException | IllegalArgumentException e) {
            responder(request, response, HttpServletResponse.SC_UNAUTHORIZED, "El token no es válido o ya venció.");
        }
    }

    private boolean esRutaPublica(HttpServletRequest request) {
        String ruta = request.getRequestURI();
        String metodo = request.getMethod();

        if ("/api/usuarios/iniciar-sesion".equals(ruta)
                || "/api/usuarios/registrar".equals(ruta)
                || "/api/usuarios/renovar-token".equals(ruta)) {
            return "POST".equalsIgnoreCase(metodo);
        }

        return "GET".equalsIgnoreCase(metodo)
                && ("/api/productos".equals(ruta) || ruta.startsWith("/api/productos/codigo/"));
    }

    private boolean puedeAcceder(HttpServletRequest request, long usuarioId, String rol) {
        String ruta = request.getRequestURI();
        String metodo = request.getMethod();

        if (ruta.startsWith("/api/usuarios/interno/")) return false;
        if (ruta.equals("/api/usuarios/validar-token")) return true;
        if (ruta.startsWith("/api/usuarios")) return "ADMIN".equals(rol);

        if (ruta.startsWith("/api/productos")) {
            return ROLES_GESTION.contains(rol);
        }

        if (ruta.startsWith("/api/pedidos")) {
            if ("POST".equalsIgnoreCase(metodo) && "/api/pedidos".equals(ruta)) return true;

            if (ruta.startsWith("/api/pedidos/usuario/")) {
                Long idRuta = ultimoNumero(ruta);
                return ROLES_GESTION.contains(rol) || (idRuta != null && idRuta == usuarioId);
            }

            if (ruta.startsWith("/api/pedidos/codigo/")) return ROLES_GESTION.contains(rol);
            return ROLES_GESTION.contains(rol);
        }

        if (ruta.startsWith("/api/notificaciones")) {
            if (ruta.equals("/api/notificaciones/interna")) return false;
            if (ruta.equals("/api/notificaciones/todas")) return "ADMIN".equals(rol);

            if (ruta.startsWith("/api/notificaciones/usuario/")) {
                Long idRuta = primerNumeroDespuesDe(ruta, "/api/notificaciones/usuario/");
                return ROLES_GESTION.contains(rol) || (idRuta != null && idRuta == usuarioId);
            }

            String usuarioIdParametro = request.getParameter("usuarioId");
            if (usuarioIdParametro != null && !ROLES_GESTION.contains(rol)) {
                try {
                    return Long.parseLong(usuarioIdParametro) == usuarioId;
                } catch (NumberFormatException e) {
                    return false;
                }
            }
            return true;
        }

        return true;
    }

    private Long ultimoNumero(String ruta) {
        int posicion = ruta.lastIndexOf('/');
        if (posicion < 0 || posicion == ruta.length() - 1) return null;
        try {
            return Long.parseLong(ruta.substring(posicion + 1));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Long primerNumeroDespuesDe(String ruta, String prefijo) {
        String resto = ruta.substring(prefijo.length());
        int barra = resto.indexOf('/');
        String valor = barra >= 0 ? resto.substring(0, barra) : resto;
        try {
            return Long.parseLong(valor);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private void responder(HttpServletRequest request, HttpServletResponse response, int estado, String mensaje) throws IOException {
        response.setStatus(estado);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType("application/json");
        String origen = request.getHeader("Origin");
        if ("http://localhost:5173".equals(origen) || "http://127.0.0.1:5173".equals(origen)) {
            response.setHeader("Access-Control-Allow-Origin", origen);
            response.setHeader("Access-Control-Allow-Credentials", "true");
        }
        response.getWriter().write("{\"mensaje\":\"" + escapar(mensaje) + "\"}");
    }

    private String escapar(String texto) {
        return texto.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
