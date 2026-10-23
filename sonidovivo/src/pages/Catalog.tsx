
import { useMemo, useState } from 'react';
import type { Product } from '../types';
import { categories } from '../data/Products';
import ProductCard from '../components/molecules/ProductCard';

interface CatalogProps {
  products: Product[];
  onAdd: (p: Product) => void;
}

export default function Catalog({ products, onAdd }: CatalogProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const filtered = useMemo(() => {
    return products.filter(
      (p) =>
        (p.Nombre + ' ' + p.Marca + ' ' + p.Codigo)
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (category === 'ALL' || p.Categoria === category)
    );
  }, [products, search, category]);

  return (
    <main className="page">
      <section className="page-heading">
        <span className="eyebrow">SONIDO VIVO</span>

        <h1>Catálogo de instrumentos</h1>

        <p>
          Envíos a todo Chile o retiro gratuito en nuestra tienda de Viña del Mar.
        </p>
      </section>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar producto, marca o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="ALL">Todas las categorías</option>

          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="muted result-count">
        {filtered.length} producto(s) encontrados
      </p>

      <div className="product-grid">
        {filtered.map((p) => (
          <ProductCard
            key={p.Codigo}
            product={p}
            onAdd={onAdd}
          />
        ))}
      </div>
    </main>
  );
}