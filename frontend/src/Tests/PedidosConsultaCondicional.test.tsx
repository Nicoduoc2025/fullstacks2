import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Pedidos from '../pages/Orders';

test('seguimiento muestra resultado únicamente después de consultar y normaliza código', () => {
  render(<Pedidos />); expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Ej. SV-8041'), { target: { value: '  sv-8041  ' } });
  expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /consultar estado/i }));
  expect(screen.getByRole('heading', { name: 'Pedido: SV-8041' })).toBeInTheDocument();
  expect(screen.getByText(/Estado de demostración: En preparación/)).toBeInTheDocument();
});

