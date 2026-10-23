import type { Product, Role } from '../types';
import { Plus } from 'lucide-react';
import Button from '../components/atoms/Button';

interface StockProps {
  products: Product[];
  onRestock: (code: string) => void;
  role: Role;
}

export default function Stock({ products, onRestock, role }: StockProps) {
  return (
    <main className="page">
      <section className="page-heading">
        <span className="eyebrow">PANEL INTERNO</span>
        <h1>Control de inventario</h1>
        <p>
          {role === 'ADMIN'
            ? 'Administrador: puedes revisar y reabastecer el stock.'
            : 'Vendedor: puedes reabastecer el stock.'}
        </p>
      </section>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.Codigo}>
                <td>{p.Codigo}</td>
                <td>
                  {p.Nombre} <small className="muted">{p.Marca}</small>
                </td>
                <td>{p.Categoria}</td>
                <td>{p.Precio.toLocaleString('es-CL')} CLP</td>
                <td>{p.Stock}</td>
                <td>
                  <span className={p.Stock ? 'stock' : 'out'}>
                    {p.Stock ? 'Disponible' : 'Agotado'}
                  </span>
                </td>
                <td>
                  <Button className="small" onClick={() => onRestock(p.Codigo)}>
                    <Plus size={15} /> +1
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}