import { useNavigate } from 'react-router-dom';
import { Guitar, Music2 } from 'lucide-react';
import LoginForm from '../components/organisms/LoginForm';

interface LoginProps {
  onLogin: (
    email: string,
    password: string
  ) => string | null;
}

export default function Login({
  onLogin,
}: LoginProps) {
  const navigate = useNavigate();

  function handleLogin(
    email: string,
    password: string
  ) {
    const error = onLogin(
      email,
      password
    );

    if (!error) {
      navigate('/');
    }

    return error;
  }

  return (
    <main className="login-wrap">
      <section className="login-card">
        <div className="login-logo">
          <Guitar size={34} />

          <span>SONIDO VIVO</span>
        </div>

        <h1>Iniciar sesión</h1>

        <p className="muted">
          Ingresa con tu cuenta para acceder
          según tu perfil.
        </p>

        <LoginForm
          onLogin={handleLogin}
        />

        <p className="demo-note">
          <Music2 size={15} />

          El sistema valida las credenciales
          y asigna el perfil automáticamente.
        </p>
      </section>
    </main>
  );
}