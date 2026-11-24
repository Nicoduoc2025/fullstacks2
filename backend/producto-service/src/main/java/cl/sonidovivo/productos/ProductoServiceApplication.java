package cl.sonidovivo.productos;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(info = @Info(title = "Sonido Vivo - API de productos", version = "1.0"))
@SpringBootApplication
public class ProductoServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProductoServiceApplication.class, args);
    }
}
