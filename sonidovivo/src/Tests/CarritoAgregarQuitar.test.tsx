import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import App from '../App';
import Orders from '../pages/Orders';
import { initialProducts } from '../data/products';
import { initialUsers } from '../data/Usuarios';

function start(email = 'admin@sonidovivo.cl', password = 'admin123') {
  render(<MemoryRouter initialEntries={['/login']}><App /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i }));
}
function go(name: string) { fireEvent.click(screen.getByRole('link', { name })); }

test('carrito agrega cantidades del mismo producto y permite quitarlo', () => {
  start(); go('Catálogo');
  const card = screen.getByRole('heading', { name: initialProducts[0].Nombre }).closest('article')!;
  fireEvent.click(within(card).getByRole('button')); fireEvent.click(within(card).getByRole('button'));
  expect(screen.getByRole('button', { name: 'Abrir carrito' })).toHaveTextContent('2');
  fireEvent.click(screen.getByRole('button', { name: 'Abrir carrito' }));
  expect(screen.getByText('2 × 129.990 CLP')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));
  expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Abrir carrito' })).toHaveTextContent('0');
});
