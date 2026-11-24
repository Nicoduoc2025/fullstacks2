package cl.sonidovivo.usuarios.controller;

import java.util.List;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import cl.sonidovivo.usuarios.dto.*;
import cl.sonidovivo.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService servicio;

    public UsuarioController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    @Operation(summary = "Iniciar sesión y generar tokens JWT")
    @PostMapping("/iniciar-sesion")
    public RespuestaAutenticacion iniciarSesion(@Valid @RequestBody SolicitudInicioSesion solicitud) {
        return servicio.iniciarSesion(solicitud);
    }

    @Operation(summary = "Registrar un cliente y generar tokens JWT")
    @PostMapping("/registrar")
    public ResponseEntity<RespuestaAutenticacion> registrar(
            @Valid @RequestBody SolicitudRegistroCliente solicitud) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.registrarCliente(solicitud));
    }

    @Operation(summary = "Renovar los tokens de una sesión")
    @PostMapping("/renovar-token")
    public RespuestaAutenticacion renovarToken(@Valid @RequestBody SolicitudRenovacionToken solicitud) {
        return servicio.renovarToken(solicitud);
    }

    @Operation(summary = "Verificar un token JWT de acceso")
    @PostMapping("/validar-token")
    public UsuarioResponse validarToken(@RequestHeader("Authorization") String autorizacion) {
        return servicio.validarToken(extraerToken(autorizacion));
    }

    @Operation(summary = "Listar usuarios")
    @GetMapping
    public List<UsuarioResponse> listar() {
        return servicio.listar();
    }

    @Operation(summary = "Obtener usuario por ID")
    @GetMapping("/{id}")
    public UsuarioResponse buscar(@PathVariable Long id) {
        return servicio.buscar(id);
    }

    @Operation(summary = "Crear usuario")
    @PostMapping
    public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody UsuarioCreateRequest solicitud) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(solicitud));
    }

    @Operation(summary = "Actualizar usuario")
    @PutMapping("/{id}")
    public UsuarioResponse actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioUpdateRequest solicitud) {
        return servicio.actualizar(id, solicitud);
    }

    @Operation(summary = "Cambiar estado de usuario")
    @PatchMapping("/{id}/estado")
    public UsuarioResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoRequest solicitud) {
        return servicio.cambiarEstado(id, solicitud);
    }

    @Operation(summary = "Eliminar usuario")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Consulta de usuario para otros microservicios")
    @GetMapping("/interno/{id}")
    public UsuarioInternoResponse interno(@PathVariable Long id) {
        return servicio.aInterno(servicio.buscarEntidad(id));
    }

    private String extraerToken(String autorizacion) {
        if (autorizacion == null || !autorizacion.startsWith("Bearer ")) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Debe enviar un token Bearer.");
        }
        return autorizacion.substring(7);
    }
}
