package cl.sonidovivo.usuarios.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.usuarios.dto.*;
import cl.sonidovivo.usuarios.model.*;
import cl.sonidovivo.usuarios.repository.UsuarioRepository;
import cl.sonidovivo.usuarios.seguridad.ServicioJwt;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

@Service
public class UsuarioService {

    private final UsuarioRepository repositorio;
    private final PasswordEncoder codificadorContrasena;
    private final ServicioJwt servicioJwt;

    public UsuarioService(
            UsuarioRepository repositorio,
            PasswordEncoder codificadorContrasena,
            ServicioJwt servicioJwt) {
        this.repositorio = repositorio;
        this.codificadorContrasena = codificadorContrasena;
        this.servicioJwt = servicioJwt;
    }

    @Transactional(readOnly = true)
    public RespuestaAutenticacion iniciarSesion(SolicitudInicioSesion solicitud) {
        Usuario usuario = repositorio.findByCorreoIgnoreCase(solicitud.correo().trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos."));

        validarUsuarioActivo(usuario);

        if (!codificadorContrasena.matches(solicitud.contrasena(), usuario.getContrasenaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos.");
        }

        return crearAutenticacion(usuario);
    }

    @Transactional
    public RespuestaAutenticacion registrarCliente(SolicitudRegistroCliente solicitud) {
        String correo = solicitud.correo().trim().toLowerCase();
        if (repositorio.existsByCorreoIgnoreCase(correo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(solicitud.nombreUsuario().trim());
        usuario.setCorreo(correo);
        usuario.setContrasenaHash(codificadorContrasena.encode(solicitud.contrasena()));
        usuario.setRol(Rol.CLIENTE);
        usuario.setEstado(EstadoUsuario.ACTIVO);
        usuario = repositorio.save(usuario);

        return crearAutenticacion(usuario);
    }

    @Transactional(readOnly = true)
    public RespuestaAutenticacion renovarToken(SolicitudRenovacionToken solicitud) {
        try {
            Claims claims = servicioJwt.validarTokenRenovacion(solicitud.tokenRenovacion());
            Usuario usuario = buscarUsuarioDesdeClaims(claims);
            validarUsuarioActivo(usuario);
            return crearAutenticacion(usuario);
        } catch (JwtException | IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "El token de renovación no es válido o venció.");
        }
    }

    @Transactional(readOnly = true)
    public UsuarioResponse validarToken(String token) {
        try {
            Claims claims = servicioJwt.validarTokenAcceso(token);
            Usuario usuario = buscarUsuarioDesdeClaims(claims);
            validarUsuarioActivo(usuario);
            return aResponse(usuario);
        } catch (JwtException | IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "El token de acceso no es válido o venció.");
        }
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return repositorio.findAll().stream().map(this::aResponse).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscar(Long id) {
        return aResponse(buscarEntidad(id));
    }

    @Transactional(readOnly = true)
    public Usuario buscarEntidad(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    @Transactional
    public UsuarioResponse crear(UsuarioCreateRequest solicitud) {
        if (repositorio.existsByCorreoIgnoreCase(solicitud.correo().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(solicitud.nombreUsuario().trim());
        usuario.setCorreo(solicitud.correo().trim().toLowerCase());
        usuario.setContrasenaHash(codificadorContrasena.encode(solicitud.contrasena()));
        usuario.setRol(parseRol(solicitud.rol()));
        usuario.setEstado(parseEstado(solicitud.estado()));
        return aResponse(repositorio.save(usuario));
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioUpdateRequest solicitud) {
        Usuario usuario = buscarEntidad(id);

        repositorio.findByCorreoIgnoreCase(solicitud.correo().trim()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo.");
            }
        });

        usuario.setNombreUsuario(solicitud.nombreUsuario().trim());
        usuario.setCorreo(solicitud.correo().trim().toLowerCase());
        usuario.setRol(parseRol(solicitud.rol()));
        usuario.setEstado(parseEstado(solicitud.estado()));

        if (solicitud.contrasena() != null && !solicitud.contrasena().isBlank()) {
            usuario.setContrasenaHash(codificadorContrasena.encode(solicitud.contrasena()));
        }

        return aResponse(repositorio.save(usuario));
    }

    @Transactional
    public UsuarioResponse cambiarEstado(Long id, EstadoRequest solicitud) {
        Usuario usuario = buscarEntidad(id);
        usuario.setEstado(parseEstado(solicitud.estado()));
        return aResponse(repositorio.save(usuario));
    }

    @Transactional
    public void eliminar(Long id) {
        repositorio.delete(buscarEntidad(id));
    }

    public UsuarioResponse aResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombreUsuario(),
                usuario.getCorreo(),
                usuario.getRol().name(),
                usuario.getEstado() == EstadoUsuario.ACTIVO ? "Activo" : "Inactivo");
    }

    public UsuarioInternoResponse aInterno(Usuario usuario) {
        return new UsuarioInternoResponse(
                usuario.getId(),
                usuario.getNombreUsuario(),
                usuario.getCorreo(),
                usuario.getRol().name(),
                usuario.getEstado().name(),
                usuario.getEstado() == EstadoUsuario.ACTIVO);
    }

    private RespuestaAutenticacion crearAutenticacion(Usuario usuario) {
        return new RespuestaAutenticacion(
                servicioJwt.crearTokenAcceso(usuario),
                servicioJwt.crearTokenRenovacion(usuario),
                aResponse(usuario));
    }

    private Usuario buscarUsuarioDesdeClaims(Claims claims) {
        Number id = claims.get("usuarioId", Number.class);
        if (id == null) {
            throw new IllegalArgumentException("El token no contiene usuario.");
        }

        Usuario usuario = buscarEntidad(id.longValue());
        String correoToken = claims.getSubject();
        String rolToken = claims.get("rol", String.class);

        if (!usuario.getCorreo().equalsIgnoreCase(correoToken)
                || !usuario.getRol().name().equals(rolToken)) {
            throw new IllegalArgumentException("Los datos del token no corresponden al usuario.");
        }
        return usuario;
    }

    private void validarUsuarioActivo(Usuario usuario) {
        if (usuario.getEstado() != EstadoUsuario.ACTIVO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Esta cuenta está inactiva.");
        }
    }

    private Rol parseRol(String valor) {
        try {
            return Rol.valueOf(valor.trim().toUpperCase());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol inválido.");
        }
    }

    private EstadoUsuario parseEstado(String valor) {
        String normalizado = valor.trim().toUpperCase();
        if ("ACTIVO".equals(normalizado)) return EstadoUsuario.ACTIVO;
        if ("INACTIVO".equals(normalizado)) return EstadoUsuario.INACTIVO;
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido.");
    }
}
