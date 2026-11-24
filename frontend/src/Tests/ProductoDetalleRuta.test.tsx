import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import DetalleProducto from '../pages/ProductDetail';
import { productosIniciales } from '../data/products';

test('la ruta de detalle usa el parámetro de código para mostrar el producto correcto', () => {
  render(
    <MemoryRouter initialEntries={['/producto/GA002']}>
      <Routes>
        <Route path="/producto/:codigo" element={<DetalleProducto productos={productosIniciales} alAgregar={vi.fn()} />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: productosIniciales[1].Nombre })).toBeInTheDocument();
  expect(screen.getByText(/Código GA002/)).toBeInTheDocument();
});
