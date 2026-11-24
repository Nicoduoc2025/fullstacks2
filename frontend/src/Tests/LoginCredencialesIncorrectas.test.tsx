import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioLogin from '../components/organisms/LoginForm';

function fill(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
}
function submit() { fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i })); }

test('muestra el error devuelto por la autenticación', () => {
  const login = vi.fn().mockReturnValue('Correo o contraseña incorrectos.');
  render(<FormularioLogin alIniciarSesion={login} />); fill('nico@example.cl', 'abcdef'); submit();
  expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.');
});

