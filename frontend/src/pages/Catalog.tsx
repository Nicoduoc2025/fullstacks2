import { useMemo, useState } from 'react';
import type { Producto } from '../types';
import TarjetaProducto from '../components/molecules/ProductCard';

interface PropiedadesCatalogo {
  productos: Producto[];
  alAgregar: (producto: Producto) => void;
}

export default function Catalogo({ productos, alAgregar }: PropiedadesCatalogo) {
  const [busqueda, establecerBusqueda] = useState('');
  const [categoria, establecerCategoria] = useState('ALL');

  const categorias = useMemo(
    () => Array.from(new Set(productos.map((producto) => producto.Categoria))).sort(),
    [productos],
  );

  const productosFiltrados = useMemo(() => {
    return productos.filter(
      (producto) =>
        (producto.Nombre + ' ' + producto.Marca + ' ' + producto.Codigo)
          .toLowerCase()
          .includes(busqueda.toLowerCase()) &&
        (categoria === 'ALL' || producto.Categoria === categoria),
    );
  }, [productos, busqueda, categoria]);

  return (
    <main className="pagina container py-4">
      <section className="encabezado-pagina">
        <span className="etiqueta-superior">SONIDO VIVO</span>
        <h1>Catálogo de instrumentos</h1>
        <p>Envíos a todo Chile o retiro gratuito en nuestra tienda de Viña del Mar.</p>
      </section>

      <div className="filtros row g-2">
        <div className="col-12 col-md-8">
          <input
            className="w-100"
            type="text"
            placeholder="Buscar producto, marca o código..."
            value={busqueda}
            onChange={(evento) => establecerBusqueda(evento.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="w-100"
            value={categoria}
            onChange={(evento) => establecerCategoria(evento.target.value)}
          >
            <option value="ALL">Todas las categorías</option>
            {categorias.map((opcion) => (
              <option key={opcion} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="texto-secundario cantidad-resultados">
        {productosFiltrados.length} producto(s) encontrados
      </p>

      <div className="row g-3 cuadricula-productos-bootstrap">
        {productosFiltrados.map((producto) => (
          <div className="col-12 col-md-6 col-lg-4" key={producto.Codigo}>
            <TarjetaProducto producto={producto} alAgregar={alAgregar} />
          </div>
        ))}
      </div>
    </main>
  );
}
