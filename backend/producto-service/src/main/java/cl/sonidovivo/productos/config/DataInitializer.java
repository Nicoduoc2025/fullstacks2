package cl.sonidovivo.productos.config;

import java.math.BigDecimal;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductoRepository repository;

    public DataInitializer(ProductoRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        crear("GA001","Guitarras Acústicas","Guitarra Acústica Folk","Yamaha","F310",8,129990,"/img/Guitarra Acústica Folk.webp");
        crear("GA002","Guitarras Acústicas","Guitarra Acústica Dreadnought","Fender","CD-60S",5,189990,"/img/Guitarra Acústica Dreadnought.jpg");
        crear("GE001","Guitarras Eléctricas","Guitarra Eléctrica Stratocaster","Squier","Affinity Strat",6,249990,"/img/Guitarra Eléctrica Stratocaster.webp");
        crear("BE001","Bajos Eléctricos","Bajo Eléctrico 4 Cuerdas","Ibanez","GSR200",7,219990,"/img/Bajo Eléctrico 4 Cuerdas.webp");
        crear("TC001","Teclados y Pianos","Piano Digital 88 Teclas","Casio","CDP-S110",3,389990,"/img/Piano Digital 88 Teclas.jpeg");
        crear("BT001","Baterías","Batería Acústica 5 Cuerpos","Pearl","Roadshow",2,529990,"/img/Batería Acústica 5 Cuerpos.webp");
        crear("AM001","Amplificadores","Amplificador Guitarra 15W","Marshall","MG15G",9,119990,"/img/Amplificador Guitarra 15W.webp");
        crear("PD001","Pedales de Efectos","Pedal Overdrive Classic","Boss","SD-1",12,69990,"/img/Pedal Overdrive Classic.webp");
    }

    private void crear(String codigo, String categoria, String nombre, String marca, String modelo,
            int stock, long precio, String imagen) {
        Producto p = new Producto();
        p.setCodigo(codigo);
        p.setCategoria(categoria);
        p.setNombre(nombre);
        p.setMarca(marca);
        p.setModelo(modelo);
        p.setStock(stock);
        p.setPrecio(BigDecimal.valueOf(precio));
        p.setImagen(imagen);
        p.setActivo(true);
        repository.save(p);
    }
}
