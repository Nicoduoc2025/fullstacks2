package cl.sonidovivo.pedidos.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import cl.sonidovivo.pedidos.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByCodigoPedidoIgnoreCase(String codigoPedido);
    List<Pedido> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
    List<Pedido> findAllByOrderByFechaCreacionDesc();
}
