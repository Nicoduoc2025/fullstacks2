import { useState } from 'react';
import Boton from '../atoms/Button';
import CampoFormulario from '../molecules/FormField';

type PropiedadesFormularioLogin = {
  alIniciarSesion: (correo: string, contrasena: string) => Promise<string | null>;
};

type ErroresFormulario = {
  correo?: string;
  contrasena?: string;
};

export default function FormularioLogin({ alIniciarSesion }: PropiedadesFormularioLogin) {
  const [correo, establecerCorreo] = useState('');
  const [contrasena, establecerContrasena] = useState('');
  const [errores, establecerErrores] = useState<ErroresFormulario>({});
  const [errorLogin, establecerErrorLogin] = useState('');
  const [enviando, establecerEnviando] = useState(false);

  function validar() {
    const nuevosErrores: ErroresFormulario = {};
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (correo.trim() === '') {
      nuevosErrores.correo = 'Debe ingresar su correo electrónico.';
    } else if (!expresionCorreo.test(correo.trim())) {
      nuevosErrores.correo = 'Debe ingresar un correo electrónico válido.';
    }

    if (contrasena.trim() === '') {
      nuevosErrores.contrasena = 'Debe ingresar su contraseña.';
    } else if (contrasena.length < 6) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
    }

    return nuevosErrores;
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    establecerErrorLogin('');

    const nuevosErrores = validar();
    establecerErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    establecerEnviando(true);
    const error = await alIniciarSesion(correo.trim(), contrasena);
    establecerEnviando(false);
    if (error) establecerErrorLogin(error);
  }

  return (
    <form onSubmit={enviar} noValidate>
      <CampoFormulario
        etiqueta="Correo electrónico"
        type="email"
        nombre="correo"
        placeholder="tu@correo.cl"
        valor={correo}
        alCambiarValor={(valor) => {
          establecerCorreo(valor);
          if (errores.correo) {
            establecerErrores((anteriores) => ({ ...anteriores, correo: undefined }));
          }
          if (errorLogin) establecerErrorLogin('');
        }}
        error={errores.correo}
        autoComplete="email"
      />

      <CampoFormulario
        etiqueta="Contraseña"
        type="password"
        nombre="contrasena"
        placeholder="Tu contraseña"
        valor={contrasena}
        alCambiarValor={(valor) => {
          establecerContrasena(valor);
          if (errores.contrasena) {
            establecerErrores((anteriores) => ({ ...anteriores, contrasena: undefined }));
          }
          if (errorLogin) establecerErrorLogin('');
        }}
        error={errores.contrasena}
        autoComplete="current-password"
      />

      {errorLogin && <p className="error-login" role="alert">{errorLogin}</p>}

      <Boton type="submit" className="ancho-completo" disabled={enviando}>
        {enviando ? 'Conectando...' : 'Entrar al sistema'}
      </Boton>
    </form>
  );
}
