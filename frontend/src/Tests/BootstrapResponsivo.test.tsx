import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Catalogo from '../pages/Catalog';
import { productosIniciales } from '../data/products';

test('catálogo aplica clases Bootstrap responsivas a las tarjetas', () => {
  const { container } = render(<Catalogo productos={productosIniciales} alAgregar={vi.fn()} />);
  expect(screen.getByRole('main')).toHaveClass('container');
  const columns = container.querySelectorAll('.col-12.col-md-6.col-lg-4');
  expect(columns).toHaveLength(productosIniciales.length);
});
