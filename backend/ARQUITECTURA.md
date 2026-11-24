# Arquitectura backend Sonido Vivo

## Separación de datos

- `usuario-service` usa exclusivamente `sonidovivo_usuarios`.
- `producto-service` usa exclusivamente `sonidovivo_productos`.
- `pedido-service` usa exclusivamente `sonidovivo_pedidos`.
- `notificacion-service` usa exclusivamente `sonidovivo_notificaciones`.

Los datos de otros servicios, como `usuarioId`, `productoCodigo` o `pedidoId`, se guardan como referencias lógicas. Un microservicio no consulta directamente las tablas de otro.

`Pedido` y `DetallePedido` pertenecen al mismo microservicio, por lo que sí utilizan una relación FK interna entre sus tablas.

## Eureka y API Gateway

Eureka registra los microservicios disponibles. API Gateway usa rutas `lb://nombre-servicio` para encontrarlos a través de Eureka.

El frontend consume una sola dirección principal:

```text
http://localhost:8080/api/...
```

## Comunicación entre microservicios

`pedido-service` usa OpenFeign siguiendo el mismo patrón general de Zenvok:

- `UsuarioClient` consulta la existencia y estado del usuario.
- `ProductoClient` consulta el producto y descuenta stock.
- `NotificacionClient` crea una notificación al generar o actualizar un pedido.

La comunicación se realiza por API REST. No se comparten tablas ni repositorios entre microservicios.

## Contraseñas, JWT y sesión

`usuario-service` utiliza `BCryptPasswordEncoder` para almacenar las contraseñas encriptadas.

Cuando el usuario inicia sesión, el servicio genera dos JWT:

- token de acceso: se usa en las peticiones protegidas;
- token de renovación: permite obtener una sesión nueva cuando el token de acceso vence.

El frontend envía el token con el encabezado `Authorization: Bearer ...`. API Gateway revisa la firma, el vencimiento y el rol antes de enviar la petición al microservicio correspondiente.

El frontend guarda la sesión y los tokens en `sessionStorage` para mantener la autenticación después de recargar la página.

Las restricciones principales son:

- catálogo público para cualquier visitante;
- pedidos y notificaciones del cliente requieren sesión;
- inventario y gestión de pedidos: VENDEDOR o ADMIN;
- gestión de usuarios: solo ADMIN.
