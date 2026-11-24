import { useState } from 'react';
import { Guitar, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Boton from '../components/atoms/Button';
import CampoFormulario from '../components/molecules/FormField';

interface PropiedadesRegistro {
  alRegistrar: (nombreUsuario: string, correo: string, contrasena: string) => Promise<string | null>;
}

type ErroresRegistro = {
  nombre?: string;
  correo?: string;
  contrasena?: string;
};

export default function Registro({ alRegistrar }: PropiedadesRegistro) {
  const [nombre, establecerNombre] = useState('');
  const [correo, establecerCorreo] = useState('');
  const [contrasena, establecerContrasena] = useState('');
  const [errores, establecerErrores] = useState<ErroresRegistro>({});
  const [errorRegistro, establecerErrorRegistro] = useState('');
  const [enviando, establecerEnviando] = useState(false);
  const navegar = useNavigate();

  function validar() {
    const nuevosErrores: ErroresRegistro = {};
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre.trim()) nuevosErrores.nombre = 'Debe ingresar su nombre.';
    if (!correo.trim()) nuevosErrores.correo = 'Debe ingresar su correo electrónico.';
    else if (!expresionCorreo.test(correo.trim())) nuevosErrores.correo = 'Debe ingresar un correo válido.';
    if (!contrasena) nuevosErrores.contrasena = 'Debe ingresar una contraseña.';
    else if (contrasena.length < 6) nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres.';

    return nuevosErrores;
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    establecerErrorRegistro('');
    const nuevosErrores = validar();
    establecerErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    establecerEnviando(true);
    const error = await alRegistrar(nombre.trim(), correo.trim(), contrasena);
    establecerEnviando(false);

    if (error) {
      establecerErrorRegistro(error);
      return;
    }

    navegar('/');
  }

  return (
    <main className="contenedor-login">
      <section className="tarjeta-login">
        <div className="logo-login">
          <Guitar size={34} />
          <span>SONIDO VIVO</span>
        </div>

        <h1>Crear cuenta</h1>
        <p className="texto-secundario">
          El registro crea una cuenta de cliente para poder confirmar compras y consultar pedidos.
        </p>

        <form onSubmit={enviar} noValidate>
          <CampoFormulario
            etiqueta="Nombre"
            type="text"
            nombre="nombre"
            placeholder="Tu nombre"
            valor={nombre}
            alCambiarValor={establecerNombre}
            error={errores.nombre}
            autoComplete="name"
          />

          <CampoFormulario
            etiqueta="Correo electrónico"
            type="email"
            nombre="correo"
            placeholder="tu@correo.cl"
            valor={correo}
            alCambiarValor={establecerCorreo}
            error={errores.correo}
            autoComplete="email"
          />

          <CampoFormulario
            etiqueta="Contraseña"
            type="password"
            nombre="contrasena"
            placeholder="Mínimo 6 caracteres"
            valor={contrasena}
            alCambiarValor={establecerContrasena}
            error={errores.contrasena}
            autoComplete="new-password"
          />

          {errorRegistro && <p className="error-login" role="alert">{errorRegistro}</p>}

          <Boton type="submit" className="ancho-completo" disabled={enviando}>
            <UserPlus size={17} />
            {enviando ? 'Creando cuenta...' : 'Registrarme como cliente'}
          </Boton>
        </form>

        <p className="enlace-cuenta">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}
