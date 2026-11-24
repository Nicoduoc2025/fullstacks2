import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import TarjetaProducto from '../components/molecules/ProductCard';
import { productosIniciales } from '../data/products';

test('TarjetaProducto agotado impide agregar al carrito', () => {
  const add = vi.fn(); render(<TarjetaProducto producto={{ ...productosIniciales[0], Stock: 0 }} alAgregar={add} />);
  expect(screen.getByText('Agotado')).toBeInTheDocument();
  expect(screen.getByRole('button')).toBeDisabled(); fireEvent.click(screen.getByRole('button'));
  expect(add).not.toHaveBeenCalled();
});
