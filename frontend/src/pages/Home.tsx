import { Link } from 'react-router-dom';
import { Guitar, Truck, MapPin, ShieldCheck, Music } from 'lucide-react';
import Boton from '../components/atoms/Button';

export default function Inicio() {
  return (
    <main className="pagina">
      <section className="portada">
        <div>
          <span className="etiqueta-superior">TU MÚSICA, TU SONIDO</span>
          <h1>Encuentra el sonido que te representa.</h1>
          <p>
            Instrumentos, equipos y accesorios para acompañarte desde tus primeros
            acordes hasta el escenario.
          </p>
          <Link to="/catalogo">
            <Boton>Explorar catálogo</Boton>
          </Link>
        </div>

        <div className="arte-portada">
          <Guitar size={112} />
          <span>SONIDO VIVO</span>
          <small>Instrumentos para todos los escenarios</small>
        </div>
      </section>

      <section className="seccion">
        <div className="titulo-seccion">
          <span className="etiqueta-superior">CONÓCENOS</span>
          <h2>Más que una tienda, parte de tu música.</h2>
          <p>
            Somos Sonido Vivo, una tienda de instrumentos musicales ubicada en Viña
            del Mar. Buscamos acercar equipos y accesorios a músicos de todos los niveles.
          </p>
        </div>

        <div className="cuadricula-caracteristicas">
          <article className="caracteristica">
            <Music />
            <h3>Variedad musical</h3>
            <p>Guitarras, bajos, teclados, baterías, amplificadores y accesorios.</p>
          </article>

          <article className="caracteristica">
            <Truck />
            <h3>Envíos a todo Chile</h3>
            <p>Despachos mediante Starken o Chilexpress y alternativas de retiro.</p>
          </article>

          <article className="caracteristica">
            <MapPin />
            <h3>Visítanos</h3>
            <p>Casa matriz en Calle Arlegui #450, Viña del Mar.</p>
          </article>

          <article className="caracteristica">
            <ShieldCheck />
            <h3>Atención cercana</h3>
            <p>Queremos ayudarte a encontrar el equipo adecuado para tu camino musical.</p>
          </article>
        </div>
      </section>

      <section className="llamado-accion">
        <div>
          <h2>¿Listo para encontrar tu próximo instrumento?</h2>
          <p>Revisa nuestro catálogo y descubre las opciones disponibles.</p>
        </div>
        <Link to="/catalogo"><Boton>Ver productos</Boton></Link>
      </section>

      <footer>© 2026 Sonido Vivo</footer>
    </main>
  );
}
