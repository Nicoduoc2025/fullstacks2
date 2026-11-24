package cl.sonidovivo.productos;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import cl.sonidovivo.productos.dto.ProductoRequest;
import cl.sonidovivo.productos.service.ProductoService;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:productos;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "eureka.client.register-with-eureka=false",
        "eureka.client.fetch-registry=false"
})
class ProductoIntegrationTest {

    @Autowired
    private ProductoService service;

    @Test
    void cargaProductosIniciales() {
        assertTrue(service.listar().size() >= 8);
    }

    @Test
    void crearYBuscarProducto() {
        service.crear(new ProductoRequest(
                "PR999", "Pruebas", "Producto Integración", "Sonido Vivo", "TEST",
                4, new BigDecimal("19990"), "/img/prueba.webp", true));

        assertEquals("Producto Integración", service.buscarPorCodigo("PR999").nombre());
    }
}
