import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import TarjetaProducto from '../components/molecules/ProductCard';
import { productosIniciales } from '../data/products';

test('TarjetaProducto muestra los datos recibidos y entrega el producto al agregar', () => {
  const product = productosIniciales[0]; const add = vi.fn();
  render(<TarjetaProducto producto={product} alAgregar={add} />);
  expect(screen.getByRole('heading', { name: product.Nombre })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: product.Nombre })).toHaveAttribute('src', product.Imagen);
  expect(screen.getByText(`${product.Marca} · ${product.Modelo}`)).toBeInTheDocument();
  expect(screen.getByText(`${product.Stock} unidades disponibles`)).toBeInTheDocument();
  expect(screen.getByText(product.Precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }))).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button')); expect(add).toHaveBeenCalledExactlyOnceWith(product);
});
