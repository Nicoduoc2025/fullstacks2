import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import Aplicacion from '../App';
import { usuariosIniciales } from '../data/Usuarios';

function start(email = 'admin@sonidovivo.cl', password = 'admin123') {
  render(<MemoryRouter initialEntries={['/login']}><Aplicacion /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i }));
}
function go(name: string) { fireEvent.click(screen.getByRole('link', { name })); }

test('lista usuarios y permite desactivar y volver a activar una cuenta', () => {
  start(); go('Usuarios'); expect(screen.getAllByRole('row')).toHaveLength(usuariosIniciales.length + 1);
  for (const u of usuariosIniciales) expect(screen.getByText(u.correo)).toBeInTheDocument();
  const row = screen.getByText('cliente@gmail.com').closest('tr')!;
  fireEvent.click(within(row).getByRole('button', { name: 'Desactivar' }));
  expect(within(row).getByText('Inactivo')).toBeInTheDocument();
  fireEvent.click(within(row).getByRole('button', { name: 'Activar' }));
  expect(within(row).getByText('Activo')).toBeInTheDocument();
});
