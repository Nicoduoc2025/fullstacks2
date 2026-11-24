import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioLogin from '../components/organisms/LoginForm';

function fill(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
}
function submit() { fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i })); }

test('envía correo recortado y contraseña válida de seis caracteres', () => {
  const login = vi.fn().mockReturnValue(null); render(<FormularioLogin alIniciarSesion={login} />);
  fill('  nico@example.cl  ', '123456'); submit();
  expect(login).toHaveBeenCalledExactlyOnceWith('nico@example.cl', '123456');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

