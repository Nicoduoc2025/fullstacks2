import { Link, useInRouterContext } from 'react-router-dom';
import type { Producto } from '../../types';
import Boton from '../atoms/Button';

interface PropiedadesTarjetaProducto {
  producto: Producto;
  alAgregar: (producto: Producto) => void;
}

export default function TarjetaProducto({ producto, alAgregar }: PropiedadesTarjetaProducto) {
  const dentroDelRouter = useInRouterContext();

  return (
    <article className="tarjeta-producto">
      <div className="imagen-producto">
        <img
          src={producto.Imagen}
          alt={producto.Nombre}
          onError={(evento) => {
            evento.currentTarget.style.display = 'none';
          }}
        />
        <span>{producto.Categoria}</span>
      </div>

      <div className="informacion-producto">
        <h3>{producto.Nombre}</h3>
        <p className="texto-secundario">{producto.Marca} · {producto.Modelo}</p>
        <strong className="precio">
          {producto.Precio.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
          })}
        </strong>
        <p className={producto.Stock > 0 ? 'estado-disponible' : 'estado-agotado'}>
          {producto.Stock > 0 ? `${producto.Stock} unidades disponibles` : 'Agotado'}
        </p>
        {dentroDelRouter ? (
          <Link className="enlace-detalle" to={`/producto/${producto.Codigo}`}>Ver detalle</Link>
        ) : (
          <span className="enlace-detalle">Ver detalle</span>
        )}
        <Boton disabled={producto.Stock < 1} onClick={() => alAgregar(producto)}>
          Agregar al carrito
        </Boton>
      </div>
    </article>
  );
}
