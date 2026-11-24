import { useNavigate, Link } from 'react-router-dom';
import { Guitar, Music2 } from 'lucide-react';
import FormularioLogin from '../components/organisms/LoginForm';

interface PropiedadesInicioSesion {
  alIniciarSesion: (correo: string, contrasena: string) => Promise<string | null>;
}

export default function InicioSesion({ alIniciarSesion }: PropiedadesInicioSesion) {
  const navegar = useNavigate();

  async function manejarInicioSesion(correo: string, contrasena: string) {
    const error = await alIniciarSesion(correo, contrasena);
    if (!error) navegar('/');
    return error;
  }

  return (
    <main className="contenedor-login">
      <section className="tarjeta-login">
        <div className="logo-login">
          <Guitar size={34} />
          <span>SONIDO VIVO</span>
        </div>

        <h1>Iniciar sesión</h1>
        <p className="texto-secundario">
          Ingresa con tu correo. Los vendedores y administradores acceden a sus herramientas según el rol de su cuenta.
        </p>

        <FormularioLogin alIniciarSesion={manejarInicioSesion} />

        <p className="nota-demo">
          <Music2 size={15} />
          Las contraseñas se almacenan encriptadas con BCrypt, igual que en la estructura de referencia.
        </p>

        <p className="enlace-cuenta">
          ¿Aún no tienes cuenta? <Link to="/registro">Registrarse como cliente</Link>
        </p>
      </section>
    </main>
  );
}
