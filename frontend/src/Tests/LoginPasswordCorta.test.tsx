import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioLogin from '../components/organisms/LoginForm';

function fill(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
}
function submit() { fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i })); }

test('rechaza contraseña menor a seis caracteres', () => {
  const login = vi.fn(); render(<FormularioLogin alIniciarSesion={login} />);
  fill('nico@example.cl', '12345'); submit();
  expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument();
  expect(screen.queryByText('Debe ingresar un correo electrónico válido.')).not.toBeInTheDocument();
  expect(login).not.toHaveBeenCalled();
});

