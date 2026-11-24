import type { Producto } from '../types';
import { productosIniciales } from './products';

let productos: Producto[] = productosIniciales.map((producto) => ({ ...producto }));

function clonarProductos() {
  return productos.map((producto) => ({ ...producto }));
}

export const repositorioProductos = {
  obtenerTodos(): Producto[] {
    return clonarProductos();
  },

  crear(producto: Producto): Producto[] {
    const existe = productos.some(
      (elemento) => elemento.Codigo.toLowerCase() === producto.Codigo.toLowerCase(),
    );

    if (existe) {
      throw new Error('Ya existe un producto con ese código.');
    }

    productos = [...productos, { ...producto }];
    return clonarProductos();
  },

  actualizar(codigo: string, cambios: Partial<Producto>): Producto[] {
    const indice = productos.findIndex((elemento) => elemento.Codigo === codigo);

    if (indice === -1) {
      throw new Error('Producto no encontrado.');
    }

    productos = productos.map((elemento) =>
      elemento.Codigo === codigo ? { ...elemento, ...cambios, Codigo: codigo } : elemento,
    );

    return clonarProductos();
  },

  eliminar(codigo: string): Producto[] {
    const existe = productos.some((elemento) => elemento.Codigo === codigo);

    if (!existe) {
      throw new Error('Producto no encontrado.');
    }

    productos = productos.filter((elemento) => elemento.Codigo !== codigo);
    return clonarProductos();
  },

  reiniciar(): Producto[] {
    productos = productosIniciales.map((producto) => ({ ...producto }));
    return clonarProductos();
  },
};
