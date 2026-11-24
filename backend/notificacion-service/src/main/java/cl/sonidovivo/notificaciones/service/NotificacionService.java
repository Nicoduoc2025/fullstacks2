package cl.sonidovivo.notificaciones.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.notificaciones.dto.*;
import cl.sonidovivo.notificaciones.model.*;
import cl.sonidovivo.notificaciones.repository.NotificacionRepository;

@Service
public class NotificacionService {

    private final NotificacionRepository repositorio;

    public NotificacionService(NotificacionRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Transactional
    public NotificacionResponse crear(NotificacionCreateRequest solicitud) {
        Notificacion notificacion = new Notificacion();
        notificacion.setUsuarioId(solicitud.usuarioId());
        notificacion.setPedidoId(solicitud.pedidoId());
        notificacion.setTipo(parseTipo(solicitud.tipo()));
        notificacion.setTitulo(solicitud.titulo().trim());
        notificacion.setMensaje(solicitud.mensaje().trim());
        notificacion.setLeida(false);
        return aResponse(repositorio.save(notificacion));
    }

    @Transactional(readOnly = true)
    public List<NotificacionResponse> listarPorUsuario(Long usuarioId) {
        return repositorio.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId)
                .stream().map(this::aResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<NotificacionResponse> listarTodas() {
        return repositorio.findAll().stream().map(this::aResponse).toList();
    }

    @Transactional(readOnly = true)
    public long contarNoLeidas(Long usuarioId) {
        return repositorio.countByUsuarioIdAndLeidaFalse(usuarioId);
    }

    @Transactional
    public NotificacionResponse marcarLeida(Long id, Long usuarioId) {
        Notificacion notificacion = buscar(id);
        validarPropietario(notificacion, usuarioId);
        notificacion.setLeida(true);
        return aResponse(repositorio.save(notificacion));
    }

    @Transactional
    public void marcarTodasLeidas(Long usuarioId) {
        List<Notificacion> notificaciones = repositorio.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
        notificaciones.forEach(notificacion -> notificacion.setLeida(true));
        repositorio.saveAll(notificaciones);
    }

    @Transactional
    public void eliminar(Long id, Long usuarioId) {
        Notificacion notificacion = buscar(id);
        validarPropietario(notificacion, usuarioId);
        repositorio.delete(notificacion);
    }

    private Notificacion buscar(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificación no encontrada."));
    }

    private void validarPropietario(Notificacion notificacion, Long usuarioId) {
        if (!notificacion.getUsuarioId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "La notificación no pertenece a este usuario.");
        }
    }

    private TipoNotificacion parseTipo(String valor) {
        try {
            return TipoNotificacion.valueOf(valor.trim().toUpperCase());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de notificación inválido.");
        }
    }

    public NotificacionResponse aResponse(Notificacion notificacion) {
        return new NotificacionResponse(
                notificacion.getId(),
                notificacion.getUsuarioId(),
                notificacion.getPedidoId(),
                notificacion.getTipo().name(),
                notificacion.getTitulo(),
                notificacion.getMensaje(),
                Boolean.TRUE.equals(notificacion.getLeida()),
                notificacion.getFechaCreacion());
    }
}
