import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Catalogo from '../pages/Catalog';
import { productosIniciales } from '../data/products';

function mount() { render(<Catalogo productos={productosIniciales} alAgregar={vi.fn()} />); }
function search(value: string) {
  fireEvent.change(screen.getByPlaceholderText('Buscar producto, marca o código...'), { target: { value } });
}
test('combina categoría y texto y permite restablecer ambos filtros', () => {
  mount(); fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Guitarras Acústicas' } });
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  search('fender');
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
  expect(screen.getByRole('heading', { name: 'Guitarra Acústica Dreadnought' })).toBeInTheDocument();
  search(''); fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ALL' } });
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(productosIniciales.length);
});
