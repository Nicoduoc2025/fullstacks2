import { Link } from 'react-router-dom';
import { Guitar, Truck, MapPin, ShieldCheck, Music } from 'lucide-react';
import Button from '../components/atoms/Button';

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">TU MÚSICA, TU SONIDO</span>
          <h1>Encuentra el sonido que te representa.</h1>
          <p>
            Instrumentos, equipos y accesorios para acompañarte desde tus primeros
            acordes hasta el escenario.
          </p>
          <Link to="/catalogo">
            <Button>Explorar catálogo</Button>
          </Link>
        </div>

        <div className="hero-art">
          <Guitar size={112} />
          <span>SONIDO VIVO</span>
          <small>Instrumentos para todos los escenarios</small>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <span className="eyebrow">CONÓCENOS</span>
          <h2>Más que una tienda, parte de tu música.</h2>
          <p>
            Somos Sonido Vivo, una tienda de instrumentos musicales ubicada en Viña
            del Mar. Buscamos acercar equipos y accesorios a músicos de todos los
            niveles.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature">
            <Music />
            <h3>Variedad musical</h3>
            <p>
              Guitarras, bajos, teclados, baterías, amplificadores y accesorios.
            </p>
          </article>

          <article className="feature">
            <Truck />
            <h3>Envíos a todo Chile</h3>
            <p>Despachos mediante Starken o Chilexpress y alternativas de retiro.</p>
          </article>

          <article className="feature">
            <MapPin />
            <h3>Visítanos</h3>
            <p>Casa matriz en Calle Arlegui #450, Viña del Mar.</p>
          </article>

          <article className="feature">
            <ShieldCheck />
            <h3>Atención cercana</h3>
            <p>
              Queremos ayudarte a encontrar el equipo adecuado para tu camino
              musical.
            </p>
          </article>
        </div>
      </section>

      <section className="callout">
        <div>
          <h2>¿Listo para encontrar tu próximo instrumento?</h2>
          <p>Revisa nuestro catálogo y descubre las opciones disponibles.</p>
        </div>
        <Link to="/catalogo">
          <Button>Ver productos</Button>
        </Link>
      </section>

      <footer>© 2026 Sonido Vivo </footer>
    </main>
  );
}