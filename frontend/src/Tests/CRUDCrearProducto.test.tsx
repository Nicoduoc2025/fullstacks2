import { expect, test } from 'vitest';
import { repositorioProductos } from '../data/productRepository';

test('CRUD CREATE agrega un producto al repositorio simulado', () => {
  const before = repositorioProductos.obtenerTodos();
  const product = {
    Codigo: 'MI001', Categoria: 'Micrófonos', Nombre: 'Micrófono dinámico',
    Marca: 'Shure', Modelo: 'SM58', Stock: 4, Precio: 99990, Imagen: '/img/microfono.webp',
  };

  const result = repositorioProductos.crear(product);

  expect(result).toHaveLength(before.length + 1);
  expect(result).toContainEqual(product);
});
