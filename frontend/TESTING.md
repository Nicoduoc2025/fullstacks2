# Pruebas de Sonido Vivo

La carpeta `src/Tests` contiene **21 pruebas**. Se utilizan Vitest, React Testing Library, jsdom, mocks/espías con `vi.fn()` y limpieza automática entre pruebas.

## Ejecución

```sh
npm ci
npm run test
npm run test:coverage
npm run build
```

Para generar un JSON de resultados:

```sh
npm run test:coverage -- --reporter=default --reporter=json --outputFile=testing-results.json
```

## Casos incluidos

| Archivo | Comportamiento verificado |
| --- | --- |
| LoginVacio.test.tsx | campos obligatorios vacíos |
| LoginCorreoInvalido.test.tsx | formato de correo inválido |
| LoginPasswordCorta.test.tsx | longitud mínima de contraseña |
| LoginValido.test.tsx | envío de credenciales válidas |
| LoginCredencialesIncorrectas.test.tsx | mensaje de autenticación incorrecta |
| ButtonPropsEvento.test.tsx | propiedades y evento del átomo Botón |
| ProductCardDatosEvento.test.tsx | renderizado por propiedades y evento agregar |
| ProductCardAgotado.test.tsx | comportamiento condicional sin stock |
| CatalogListaCompleta.test.tsx | listado completo de productos |
| CatalogFiltrosCombinados.test.tsx | filtro combinado texto/categoría |
| CatalogSinResultados.test.tsx | estado sin resultados |
| StockReabastecer.test.tsx | lectura de inventario y actualización de stock |
| UsuariosCambiarEstado.test.tsx | listado y cambio de estado de usuario |
| CarritoAgregarQuitar.test.tsx | eventos y cambio de estado del carrito |
| PedidosConsultaCondicional.test.tsx | resultado condicional de seguimiento |
| CRUDCrearProducto.test.tsx | CREATE del repositorio de productos |
| CRUDLeerProductos.test.tsx | READ del repositorio de productos |
| CRUDActualizarProducto.test.tsx | UPDATE del repositorio de productos |
| CRUDEliminarProducto.test.tsx | DELETE del repositorio de productos |
| ProductoDetalleRuta.test.tsx | ruta parametrizada y detalle correcto |
| BootstrapResponsivo.test.tsx | clases Bootstrap responsivas del catálogo |

## CRUD y fuente simulada

`src/data/productRepository.ts` implementa el patrón Repository mediante `repositorioProductos` y contiene las operaciones `crear`, `obtenerTodos`, `actualizar` y `eliminar` sobre una fuente de datos en memoria. `App.tsx` usa este repositorio y `Stock.tsx` integra las cuatro operaciones en la interfaz.

Las pruebas CRUD comprueban explícitamente el resultado de cada operación y `src/Tests/setup.ts` restablece el repositorio después de cada prueba para mantener aislamiento.

## Cobertura

Vitest está configurado con proveedor V8 y genera reportes `text`, `html`, `json-summary` y `lcov`. Ejecutar `npm run test:coverage` regenera la carpeta `coverage` con el estado exacto de esta versión.

La cobertura es una medida de líneas/ramas ejecutadas y no reemplaza la calidad de las comprobaciones. La rúbrica no exige un porcentaje mínimo.

## Archivos incluidos/excluidos

La cobertura incluye `src/**/*.{ts,tsx}` y excluye:

- `src/Tests/**` (código de pruebas),
- `src/main.tsx` (punto de arranque),
- declaraciones `.d.ts`,
- `src/types.ts` (tipos sin lógica ejecutable).

## Comportamientos pendientes

No existe backend ni persistencia real: la fuente de productos, usuarios, pedidos y sesión es simulada/en memoria. Integraciones con pago, despacho o base de datos quedan fuera del alcance del prototipo académico.
