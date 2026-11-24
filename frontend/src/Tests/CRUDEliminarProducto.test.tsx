import { expect, test } from 'vitest';
import { repositorioProductos } from '../data/productRepository';

test('CRUD DELETE elimina únicamente el producto indicado', () => {
  const before = repositorioProductos.obtenerTodos();
  const result = repositorioProductos.eliminar('GA001');
  expect(result).toHaveLength(before.length - 1);
  expect(result.some((product) => product.Codigo === 'GA001')).toBe(false);
  expect(result.some((product) => product.Codigo === 'GA002')).toBe(true);
});
