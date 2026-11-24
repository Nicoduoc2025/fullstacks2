package cl.sonidovivo.notificaciones.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import cl.sonidovivo.notificaciones.dto.*;
import cl.sonidovivo.notificaciones.service.NotificacionService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService servicio;

    public NotificacionController(NotificacionService servicio) {
        this.servicio = servicio;
    }

    @Operation(summary = "Listar notificaciones de un usuario")
    @GetMapping("/usuario/{usuarioId}")
    public List<NotificacionResponse> listarPorUsuario(@PathVariable Long usuarioId) {
        return servicio.listarPorUsuario(usuarioId);
    }

    @Operation(summary = "Contar notificaciones no leídas de un usuario")
    @GetMapping("/usuario/{usuarioId}/no-leidas")
    public Map<String, Long> noLeidas(@PathVariable Long usuarioId) {
        return Map.of("cantidad", servicio.contarNoLeidas(usuarioId));
    }

    @Operation(summary = "Marcar una notificación como leída")
    @PutMapping("/{id}/leer")
    public NotificacionResponse leer(@PathVariable Long id, @RequestParam Long usuarioId) {
        return servicio.marcarLeida(id, usuarioId);
    }

    @Operation(summary = "Marcar todas las notificaciones de un usuario como leídas")
    @PutMapping("/usuario/{usuarioId}/leer-todas")
    public ResponseEntity<Void> leerTodas(@PathVariable Long usuarioId) {
        servicio.marcarTodasLeidas(usuarioId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Eliminar una notificación")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @RequestParam Long usuarioId) {
        servicio.eliminar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Listar todas las notificaciones")
    @GetMapping("/todas")
    public List<NotificacionResponse> todas() {
        return servicio.listarTodas();
    }

    @Operation(summary = "Crear notificación desde otro microservicio")
    @PostMapping("/interna")
    public ResponseEntity<NotificacionResponse> crearInterna(
            @Valid @RequestBody NotificacionCreateRequest solicitud) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(solicitud));
    }
}
