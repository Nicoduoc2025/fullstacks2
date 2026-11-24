export type Rol = 'CLIENTE' | 'VENDEDOR' | 'ADMIN';

export type Producto = {
  Id?: number;
  Codigo: string;
  Categoria: string;
  Nombre: string;
  Marca: string;
  Modelo: string;
  Stock: number;
  Precio: number;
  Imagen: string;
  Activo?: boolean;
};

export type Usuario = {
  id: number;
  nombreUsuario: string;
  correo: string;
  contrasena?: string;
  rol: Rol;
  estado: 'Activo' | 'Inactivo';
};

export type Sesion = {
  id: number;
  nombreUsuario: string;
  correo: string;
  rol: Rol;
  estado: 'Activo' | 'Inactivo';
};

export type DetallePedido = {
  id: number;
  productoCodigo: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

export type Pedido = {
  id: number;
  codigoPedido: string;
  usuarioId: number;
  fechaCreacion: string;
  estado: string;
  total: number;
  detalles: DetallePedido[];
};

export type Notificacion = {
  id: number;
  usuarioId: number;
  pedidoId: number | null;
  tipo: 'PEDIDO' | 'STOCK' | 'SISTEMA';
  titulo: string;
  mensaje: string;
  leida: boolean;
  fechaCreacion: string;
};
