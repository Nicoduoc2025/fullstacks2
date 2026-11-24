package cl.sonidovivo.productos.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import cl.sonidovivo.productos.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Optional<Producto> findByCodigoIgnoreCase(String codigo);
    boolean existsByCodigoIgnoreCase(String codigo);
}
