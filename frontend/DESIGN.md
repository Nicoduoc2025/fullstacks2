# Diseño de la solución

## Atomic Design

La interfaz está organizada por niveles para que los componentes sean más fáciles de reutilizar:

- **Átomos:** botón, entrada y campo simple.
- **Moléculas:** campo de formulario y tarjeta de producto.
- **Organismos:** encabezado y formulario de inicio de sesión.
- **Páginas:** inicio de sesión, inicio, catálogo, detalle de producto, tienda, pedidos, inventario y usuarios.

Los nombres internos creados por el equipo se dejaron en español siempre que fue posible. Los nombres de carpetas `atoms`, `molecules` y `organisms` se mantienen porque corresponden a la estructura de Atomic Design trabajada en el proyecto.

## Patrón Repository

Para manejar los productos se utiliza el patrón **Repository**. Su implementación está en `src/data/productRepository.ts`.

El objeto `repositorioProductos` concentra las operaciones sobre los datos simulados:

- `obtenerTodos()` - leer los productos.
- `crear(producto)` - agregar un producto.
- `actualizar(codigo, cambios)` - modificar un producto.
- `eliminar(codigo)` - eliminar un producto.
- `reiniciar()` - volver a los datos iniciales durante las pruebas.

De esta forma, los componentes no tienen que modificar directamente la fuente de datos.

## Responsividad

Se utiliza Bootstrap 5 junto con el CSS propio del proyecto. Las clases de Bootstrap como `container`, `row`, `col-12`, `col-md-6`, `col-lg-4` o `table-responsive` no se traducen porque pertenecen a la librería.

Las clases CSS creadas por nosotros sí se dejaron en español, por ejemplo `tarjeta-producto`, `texto-secundario`, `formulario-inventario` y `encabezado-pagina`.

## Navegación

React Router se encarga de cambiar entre las distintas vistas. La ruta `/producto/:codigo` permite mostrar el detalle de un producto utilizando su código.
