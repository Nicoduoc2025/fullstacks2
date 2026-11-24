import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import Aplicacion from '../App';
import { productosIniciales } from '../data/products';

function start(email = 'admin@sonidovivo.cl', password = 'admin123') {
  render(<MemoryRouter initialEntries={['/login']}><Aplicacion /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i }));
}
function go(name: string) { fireEvent.click(screen.getByRole('link', { name })); }

test('lectura de inventario y reabastecimiento actualizan solo el producto elegido', () => {
  start(); go('Control de stock');
  expect(screen.getAllByRole('row')).toHaveLength(productosIniciales.length + 1);
  for (const p of productosIniciales) expect(screen.getByText(p.Codigo)).toBeInTheDocument();
  const row = screen.getByText('GA001').closest('tr')!;
  expect(within(row).getAllByRole('cell')[4]).toHaveTextContent(/^8$/);
  fireEvent.click(within(row).getByRole('button', { name: '+1' }));
  expect(within(row).getAllByRole('cell')[4]).toHaveTextContent(/^9$/);
  const other = screen.getByText('GA002').closest('tr')!;
  expect(within(other).getAllByRole('cell')[4]).toHaveTextContent(/^5$/);
});
