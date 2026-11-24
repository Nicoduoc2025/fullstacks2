import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Catalogo from '../pages/Catalog';
import { productosIniciales } from '../data/products';

function mount() { render(<Catalogo productos={productosIniciales} alAgregar={vi.fn()} />); }
test('catálogo lista todos los productos recibidos', () => {
  mount(); expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(productosIniciales.length);
  for (const p of productosIniciales) expect(screen.getByRole('heading', { name: p.Nombre })).toBeInTheDocument();
  expect(screen.getByText(`${productosIniciales.length} producto(s) encontrados`)).toBeInTheDocument();
});
