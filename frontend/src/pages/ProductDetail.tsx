import { Link, useParams } from 'react-router-dom';
import type { Producto } from '../types';
import Boton from '../components/atoms/Button';

interface PropiedadesDetalleProducto {
  productos: Producto[];
  alAgregar: (producto: Producto) => void;
}

export default function DetalleProducto({ productos, alAgregar }: PropiedadesDetalleProducto) {
  const { codigo } = useParams();
  const producto = productos.find((elemento) => elemento.Codigo === codigo);

  if (!producto) {
    return (
      <main className="pagina container py-4">
        <h1>Producto no encontrado</h1>
        <Link to="/catalogo" className="boton">Volver al catálogo</Link>
      </main>
    );
  }

  return (
    <main className="pagina container py-4">
      <section className="encabezado-pagina">
        <span className="etiqueta-superior">DETALLE DE PRODUCTO</span>
        <h1>{producto.Nombre}</h1>
        <p>{producto.Marca} · {producto.Modelo} · Código {producto.Codigo}</p>
      </section>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-md-6">
          <div className="imagen-detalle-producto">
            <img src={producto.Imagen} alt={producto.Nombre} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <article className="tarjeta-detalle-producto">
            <p><strong>Categoría:</strong> {producto.Categoria}</p>
            <p><strong>Marca:</strong> {producto.Marca}</p>
            <p><strong>Modelo:</strong> {producto.Modelo}</p>
            <p><strong>Stock:</strong> {producto.Stock}</p>
            <p className="precio">{producto.Precio.toLocaleString('es-CL')} CLP</p>
            <Boton disabled={producto.Stock < 1} onClick={() => alAgregar(producto)}>
              Agregar al carrito
            </Boton>
          </article>
        </div>
      </div>
    </main>
  );
}
