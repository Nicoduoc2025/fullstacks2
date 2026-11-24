import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioLogin from '../components/organisms/LoginForm';

function fill(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
}
function submit() { fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i })); }

test('rechaza correo con formato inválido sin invocar login', () => {
  const login = vi.fn(); render(<FormularioLogin alIniciarSesion={login} />);
  fill('correo-invalido', 'abcdef'); submit();
  expect(screen.getByText('Debe ingresar un correo electrónico válido.')).toBeInTheDocument();
  expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('aria-invalid', 'true');
  expect(login).not.toHaveBeenCalled();
});

