package cl.sonidovivo.notificaciones;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(info = @Info(title = "Sonido Vivo - API de notificaciones", version = "1.0"))
@SpringBootApplication
public class NotificacionServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NotificacionServiceApplication.class, args);
    }
}
