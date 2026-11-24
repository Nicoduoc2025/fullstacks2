package cl.sonidovivo.pedidos.client;

import cl.sonidovivo.pedidos.dto.NotificacionCreateRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "notificacion-service")
public interface NotificacionClient {
    @PostMapping("/api/notificaciones/interna")
    void crear(@RequestBody NotificacionCreateRequest request);
}
