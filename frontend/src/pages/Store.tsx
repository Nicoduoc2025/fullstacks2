import { MapPin, Clock, Phone, Package } from 'lucide-react';

export default function Tienda() {
  return (
    <main className="pagina">
      <section className="encabezado-pagina">
        <span className="etiqueta-superior">VEN A CONOCERNOS</span>
        <h1>Tienda física y puntos de retiro</h1>
        <p>Compra online y elige la alternativa de entrega que más te acomode.</p>
      </section>

      <div className="cuadricula-tienda">
        <article className="tarjeta-tienda">
          <MapPin />
          <h2>Casa Matriz · Viña del Mar</h2>
          <p>Calle Arlegui #450, Viña del Mar</p>
          <p><Clock size={16} /> Lunes a viernes: 10:00–19:00</p>
          <p><Clock size={16} /> Sábados: 10:00–14:00</p>
          <p><Phone size={16} /> +56 32 212 3456</p>
          <a
            href="https://www.openstreetmap.org/?mlat=-33.0245&mlon=-71.5518#map=16/-33.0245/-71.5518"
            target="_blank"
            rel="noreferrer"
          >
            Ver ubicación en mapa
          </a>
        </article>

        <article className="tarjeta-tienda">
          <Package />
          <h2>Puntos de retiro</h2>
          <p><b>Starken Viña:</b> Av. Libertad 820</p>
          <p><b>Chilexpress Reñaca:</b> Av. Borgoño 14200</p>
          <p className="texto-secundario">Confirma la disponibilidad del punto al coordinar tu entrega.</p>
        </article>
      </div>
    </main>
  );
}
