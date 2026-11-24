package cl.sonidovivo.notificaciones.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import cl.sonidovivo.notificaciones.model.Notificacion;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
    long countByUsuarioIdAndLeidaFalse(Long usuarioId);
}
