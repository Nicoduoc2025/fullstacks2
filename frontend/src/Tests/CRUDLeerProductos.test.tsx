import { expect, test } from 'vitest';
import { repositorioProductos } from '../data/productRepository';
import { productosIniciales } from '../data/products';

test('CRUD READ devuelve todos los productos de la fuente simulada', () => {
  const result = repositorioProductos.obtenerTodos();

  expect(result).toHaveLength(productosIniciales.length + 1);
  expect(result[0]).toEqual(productosIniciales[0]);
});