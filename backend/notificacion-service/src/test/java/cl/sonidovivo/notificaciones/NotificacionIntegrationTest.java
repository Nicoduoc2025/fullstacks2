package cl.sonidovivo.notificaciones;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import cl.sonidovivo.notificaciones.dto.NotificacionCreateRequest;
import cl.sonidovivo.notificaciones.service.NotificacionService;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:notificaciones;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "eureka.client.register-with-eureka=false",
        "eureka.client.fetch-registry=false"
})
class NotificacionIntegrationTest {

    @Autowired
    private NotificacionService service;

    @Test
    void crearYContarNotificacionNoLeida() {
        service.crear(new NotificacionCreateRequest(3L, 1L, "PEDIDO", "Pedido confirmado", "Pedido creado"));
        assertEquals(1, service.contarNoLeidas(3L));
    }
}
