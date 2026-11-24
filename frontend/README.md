# Interfaz web Sonido Vivo

Frontend React + TypeScript + Vite conectado a los microservicios mediante API Gateway.

```bash
npm install
npm run dev
```

La URL del Gateway se configura en `VITE_API_URL` y por defecto es `http://localhost:8080`.

Cambios principales:

- la página abre sin obligar a iniciar sesión;
- el visitante navega como CLIENTE por defecto;
- registro de clientes con correo electrónico;
- inicio de sesión opcional para CLIENTE, VENDEDOR y ADMIN;
- contraseñas encriptadas con BCrypt en el microservicio de usuarios;
- productos obtenidos desde `producto-service`;
- carrito completo con imágenes, cantidades, subtotales y total;
- para confirmar una compra se exige una cuenta registrada;
- CRUD de inventario mediante API REST;
- pedidos reales almacenados por `pedido-service`;
- notificaciones mediante `notificacion-service`;
- restricciones de interfaz según el rol.
