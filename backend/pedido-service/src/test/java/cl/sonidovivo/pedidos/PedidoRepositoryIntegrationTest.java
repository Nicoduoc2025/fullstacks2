package cl.sonidovivo.pedidos;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import cl.sonidovivo.pedidos.model.DetallePedido;
import cl.sonidovivo.pedidos.model.EstadoPedido;
import cl.sonidovivo.pedidos.model.Pedido;
import cl.sonidovivo.pedidos.repository.PedidoRepository;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:pedidos;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "eureka.client.register-with-eureka=false",
        "eureka.client.fetch-registry=false",
        "spring.cloud.openfeign.client.config.default.connectTimeout=100"
})
class PedidoRepositoryIntegrationTest {

    @Autowired
    private PedidoRepository repository;

    @Test
    void guardaPedidoConDetalleEnMismaBase() {
        Pedido pedido = new Pedido();
        pedido.setCodigoPedido("SV-TEST0001");
        pedido.setUsuarioId(3L);
        pedido.setEstado(EstadoPedido.CONFIRMADO);
        pedido.setTotal(new BigDecimal("129990"));

        DetallePedido detalle = new DetallePedido();
        detalle.setProductoCodigo("GA001");
        detalle.setProductoNombre("Guitarra Acústica Folk");
        detalle.setCantidad(1);
        detalle.setPrecioUnitario(new BigDecimal("129990"));
        detalle.setSubtotal(new BigDecimal("129990"));
        pedido.agregarDetalle(detalle);

        Pedido guardado = repository.save(pedido);
        assertNotNull(guardado.getId());
        assertEquals(1, guardado.getDetalles().size());
    }
}
