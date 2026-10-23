import { useState } from 'react';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';

type LoginFormProps = {
  onLogin: (email: string, password: string) => string | null;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [loginError, setLoginError] = useState('');

  function validate() {
    const newErrors: FormErrors = {};

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === '') {
      newErrors.email =
        'Debe ingresar su correo electrónico.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email =
        'Debe ingresar un correo electrónico válido.';
    }

    if (password.trim() === '') {
      newErrors.password =
        'Debe ingresar su contraseña.';
    } else if (password.length < 6) {
      newErrors.password =
        'La contraseña debe tener al menos 6 caracteres.';
    }

    return newErrors;
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoginError('');

    const newErrors = validate();

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const error = onLogin(
      email.trim(),
      password
    );

    if (error) {
      setLoginError(error);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <FormField
        label="Correo electrónico"
        type="email"
        name="email"
        placeholder="tu@correo.cl"
        value={email}
        onValueChange={(value) => {
          setEmail(value);

          if (errors.email) {
            setErrors((old) => ({
              ...old,
              email: undefined,
            }));
          }

          if (loginError) {
            setLoginError('');
          }
        }}
        error={errors.email}
        autoComplete="email"
      />

      <FormField
        label="Contraseña"
        type="password"
        name="password"
        placeholder="Tu contraseña"
        value={password}
        onValueChange={(value) => {
          setPassword(value);

          if (errors.password) {
            setErrors((old) => ({
              ...old,
              password: undefined,
            }));
          }

          if (loginError) {
            setLoginError('');
          }
        }}
        error={errors.password}
        autoComplete="current-password"
      />

      {loginError && (
        <p
          className="login-error"
          role="alert"
        >
          {loginError}
        </p>
      )}

      <Button
        type="submit"
        className="full"
      >
        Entrar al sistema
      </Button>
    </form>
  );
}