import { useState } from 'react';
import { Search, PackageCheck } from 'lucide-react';
import Button from '../components/atoms/Button';

export default function Orders() {
  const [code, setCode] = useState('');
  const [searched, setSearched] = useState('');

  return (
    <main className="page">
      <section className="page-heading">
        <span className="eyebrow">ESTADO DE COMPRA</span>
        <h1>Seguimiento de pedidos</h1>
        <p>Ingresa el código que recibiste al confirmar tu pedido.</p>
      </section>

      <form
        className="tracking-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(code.trim().toUpperCase());
        }}
      >
        <input
          placeholder="Ej. SV-8041"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <Button type="submit">
          <Search size={17} /> Consultar estado
        </Button>
      </form>

      {searched && (
        <article className="order-result">
          <PackageCheck />
          <div>
            <h2>Pedido: {searched}</h2>
            <p>Estado de demostración: En preparación / listo para envío.</p>
            <small>
              Esta consulta es simulada; no está conectada a un sistema logístico
              real.
            </small>
          </div>
        </article>
      )}
    </main>
  );
}