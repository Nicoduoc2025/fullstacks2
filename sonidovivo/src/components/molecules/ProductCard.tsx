import type { Product } from '../../types';
import Button from '../atoms/Button';

interface ProductCardProps {
  product: Product;
  onAdd: (p: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img
          src={product.Imagen}
          alt={product.Nombre}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span>{product.Categoria}</span>
      </div>

      <div className="product-info">
        <h3>{product.Nombre}</h3>
        <p className="muted">
          {product.Marca} · {product.Modelo}
        </p>
        <strong className="price">
          {product.Precio.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
          })}
        </strong>
        <p className={product.Stock > 0 ? 'stock' : 'out'}>
          {product.Stock > 0 ? `${product.Stock} unidades disponibles` : 'Agotado'}
        </p>
        <Button disabled={product.Stock < 1} onClick={() => onAdd(product)}>
          Agregar al carrito
        </Button>
      </div>
    </article>
  );
}