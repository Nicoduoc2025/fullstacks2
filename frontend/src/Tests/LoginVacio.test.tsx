// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioLogin from '../components/organisms/LoginForm';

test('muestra errores cuando se intenta iniciar sesión con los campos vacios', () => {
  const onLogin = vi.fn();

  render(<FormularioLogin alIniciarSesion={onLogin} />);

  fireEvent.click(
    screen.getByRole('button', {
      name: /entrar al sistema/i,
    }),
  );

  expect(
    screen.getByText('Debe ingresar su correo electrónico.'),
  ).toBeTruthy();

  expect(
    screen.getByText('Debe ingresar su contraseña.'),
  ).toBeTruthy();

  expect(onLogin).not.toHaveBeenCalled();
});