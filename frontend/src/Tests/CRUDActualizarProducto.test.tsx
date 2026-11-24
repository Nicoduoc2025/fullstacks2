import { expect, test } from 'vitest';
import { repositorioProductos } from '../data/productRepository';

test('CRUD UPDATE modifica el producto indicado sin alterar su código', () => {
  const result = repositorioProductos.actualizar('GA001', { Stock: 20, Precio: 139990 });
  const updated = result.find((product) => product.Codigo === 'GA001');
  expect(updated?.Stock).toBe(20);
  expect(updated?.Precio).toBe(139990);
  expect(updated?.Codigo).toBe('GA001');
});
