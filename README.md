# Sonido Vivo - Fullstack con microservicios

Proyecto Sonido Vivo adaptado a una arquitectura de microservicios siguiendo como referencia la estructura de Zenvok: Spring Boot, Eureka, API Gateway, OpenFeign, MySQL, Swagger y frontend React.

## Arquitectura

```text
React + Vite (5173)
        |
        v
API Gateway (8080)
        |
        +--> usuario-service (8081) ------> sonidovivo_usuarios
        +--> producto-service (8082) -----> sonidovivo_productos
        +--> pedido-service (8083) -------> sonidovivo_pedidos
        |        |--> usuario-service
        |        |--> producto-service
        |        +--> notificacion-service
        +--> notificacion-service (8084) -> sonidovivo_notificaciones

Todos los servicios se registran en Eureka (8761).
```

Cada microservicio utiliza su propia base de datos. No se comparten tablas entre servicios. `Pedido` y `DetallePedido` sí comparten base porque pertenecen al mismo microservicio y se relacionan mediante una FK interna.

## Seguridad y sesión

La seguridad se dejó solo con lo pedido por la evaluación:

- Las contraseñas se guardan encriptadas con BCrypt mediante `PasswordEncoder`.
- Al iniciar sesión o registrarse, `usuario-service` genera un token JWT de acceso y otro de renovación.
- API Gateway valida la firma, vencimiento y rol antes de dejar pasar las rutas protegidas.
- El token de acceso dura 30 minutos y el de renovación 7 días.
- Si el token de acceso vence, el frontend solicita una renovación y vuelve a intentar la petición.
- La sesión y los tokens se guardan en `sessionStorage`, por lo que la sesión se mantiene al recargar la página.
- ADMIN, VENDEDOR y CLIENTE tienen permisos distintos tanto en el frontend como en el Gateway.

Permisos principales:

- CLIENTE: navegar, comprar, revisar sus pedidos y sus notificaciones.
- VENDEDOR: administrar inventario y gestionar pedidos.
- ADMIN: además de lo anterior, administrar usuarios.

## Flujo del usuario

- La página abre sin obligar a iniciar sesión.
- El visitante navega con comportamiento de CLIENTE por defecto.
- Puede revisar catálogo, detalle de productos, tienda y armar el carrito.
- Para confirmar una compra debe registrarse o iniciar sesión.
- Todo usuario registrado desde la web se crea automáticamente como CLIENTE.
- VENDEDOR y ADMIN ingresan con sus cuentas existentes desde el botón `Iniciar sesión`.

## Carrito de compras

El carrito muestra:

- imagen del producto;
- categoría;
- nombre;
- marca y modelo;
- código;
- precio unitario;
- controles para aumentar o disminuir cantidad;
- subtotal por producto;
- total general.

## Usuarios iniciales

| Rol | Correo | Contraseña |
|---|---|---|
| ADMIN | admin@sonidovivo.cl | admin123 |
| VENDEDOR | vendedor1@sonidovivo.cl | vendedor123 |
| CLIENTE | cliente@gmail.com | cliente123 |

## Levantar todo con Docker

```bash
cd backend
docker compose up --build
```

Servicios:

- Frontend: http://localhost:5173
- Eureka: http://localhost:8761
- API Gateway: http://localhost:8080
- Swagger Usuarios: http://localhost:8081/swagger-ui.html
- Swagger Productos: http://localhost:8082/swagger-ui.html
- Swagger Pedidos: http://localhost:8083/swagger-ui.html
- Swagger Notificaciones: http://localhost:8084/swagger-ui.html
- MySQL desde el host: localhost:3307

## Frontend sin Docker

```bash
cd frontend
npm install
npm run dev
```

El frontend consume por defecto el Gateway en `http://localhost:8080`.

## Bases de datos

```text
sonidovivo_usuarios
sonidovivo_productos
sonidovivo_pedidos
sonidovivo_notificaciones
```

## Flujo de compra

1. El cliente agrega productos al carrito.
2. Si todavía no tiene cuenta, debe registrarse o iniciar sesión antes de confirmar.
3. React envía el JWT en `Authorization: Bearer ...` junto con la petición al API Gateway.
4. API Gateway valida el token y el rol antes de permitir la operación.
5. `pedido-service` consulta al microservicio de usuarios.
6. `pedido-service` consulta y descuenta stock mediante `producto-service` usando OpenFeign.
7. Se guarda `Pedido` junto a sus `DetallePedido`.
8. `pedido-service` solicita a `notificacion-service` crear una notificación.
9. El frontend actualiza productos, pedidos y notificaciones.
