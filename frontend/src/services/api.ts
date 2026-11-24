import type { Notificacion, Pedido, Producto, Sesion, Usuario } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const CLAVE_SESION = 'sonido-vivo-sesion';
const CLAVE_TOKEN_ACCESO = 'sonido-vivo-token-acceso';
const CLAVE_TOKEN_RENOVACION = 'sonido-vivo-token-renovacion';

type ProductoApi = {
  id: number;
  codigo: string;
  categoria: string;
  nombre: string;
  marca: string;
  modelo: string;
  stock: number;
  precio: number;
  imagen: string;
  activo: boolean;
};

type RespuestaAutenticacion = {
  tokenAcceso: string;
  tokenRenovacion: string;
  usuario: Sesion;
};

function guardarAutenticacion(respuesta: RespuestaAutenticacion) {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(respuesta.usuario));
  sessionStorage.setItem(CLAVE_TOKEN_ACCESO, respuesta.tokenAcceso);
  sessionStorage.setItem(CLAVE_TOKEN_RENOVACION, respuesta.tokenRenovacion);
}

function obtenerTokenAcceso() {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(CLAVE_TOKEN_ACCESO);
}

function obtenerTokenRenovacion() {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(CLAVE_TOKEN_RENOVACION);
}

export function obtenerSesionGuardada(): Sesion | null {
  if (typeof sessionStorage === 'undefined') return null;
  const guardada = sessionStorage.getItem(CLAVE_SESION);
  if (!guardada) return null;

  try {
    return JSON.parse(guardada) as Sesion;
  } catch {
    cerrarSesionGuardada();
    return null;
  }
}

export function cerrarSesionGuardada() {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(CLAVE_SESION);
  sessionStorage.removeItem(CLAVE_TOKEN_ACCESO);
  sessionStorage.removeItem(CLAVE_TOKEN_RENOVACION);
}

async function obtenerMensajeError(respuesta: Response) {
  try {
    const datos = await respuesta.json() as {
      mensaje?: string;
      message?: string;
      detail?: string;
      error?: string;
      title?: string;
    };
    return datos.mensaje || datos.message || datos.detail || datos.error || datos.title || `Error ${respuesta.status}`;
  } catch {
    return `Error ${respuesta.status}`;
  }
}

async function renovarAutenticacion(): Promise<boolean> {
  const tokenRenovacion = obtenerTokenRenovacion();
  if (!tokenRenovacion) return false;

  try {
    const respuesta = await fetch(`${API_URL}/api/usuarios/renovar-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenRenovacion }),
    });

    if (!respuesta.ok) {
      cerrarSesionGuardada();
      return false;
    }

    const datos = await respuesta.json() as RespuestaAutenticacion;
    guardarAutenticacion(datos);
    return true;
  } catch {
    return false;
  }
}

async function solicitar<T>(
  ruta: string,
  opciones: RequestInit = {},
  permitirRenovacion = true,
): Promise<T> {
  const headers = new Headers(opciones.headers ?? {});
  if (!headers.has('Content-Type') && opciones.body) {
    headers.set('Content-Type', 'application/json');
  }

  const token = obtenerTokenAcceso();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa que API Gateway esté ejecutándose.');
  }

  if (respuesta.status === 401 && permitirRenovacion && obtenerTokenRenovacion()) {
    const renovada = await renovarAutenticacion();
    if (renovada) return solicitar<T>(ruta, opciones, false);
  }

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta));
  }

  if (respuesta.status === 204) return undefined as T;
  return respuesta.json() as Promise<T>;
}

function desdeProductoApi(producto: ProductoApi): Producto {
  return {
    Id: producto.id,
    Codigo: producto.codigo,
    Categoria: producto.categoria,
    Nombre: producto.nombre,
    Marca: producto.marca,
    Modelo: producto.modelo,
    Stock: producto.stock,
    Precio: Number(producto.precio),
    Imagen: producto.imagen,
    Activo: producto.activo,
  };
}

function haciaProductoApi(producto: Producto) {
  return {
    codigo: producto.Codigo,
    categoria: producto.Categoria,
    nombre: producto.Nombre,
    marca: producto.Marca,
    modelo: producto.Modelo,
    stock: producto.Stock,
    precio: producto.Precio,
    imagen: producto.Imagen.replace(/^public\//, '/'),
    activo: producto.Activo ?? true,
  };
}

export const usuariosApi = {
  async iniciarSesion(correo: string, contrasena: string): Promise<Sesion> {
    const respuesta = await solicitar<RespuestaAutenticacion>('/api/usuarios/iniciar-sesion', {
      method: 'POST',
      body: JSON.stringify({ correo, contrasena }),
    }, false);
    guardarAutenticacion(respuesta);
    return respuesta.usuario;
  },

  async registrarCliente(nombreUsuario: string, correo: string, contrasena: string): Promise<Sesion> {
    const respuesta = await solicitar<RespuestaAutenticacion>('/api/usuarios/registrar', {
      method: 'POST',
      body: JSON.stringify({ nombreUsuario, correo, contrasena }),
    }, false);
    guardarAutenticacion(respuesta);
    return respuesta.usuario;
  },

  async validarSesion(): Promise<Sesion> {
    return solicitar<Sesion>('/api/usuarios/validar-token', { method: 'POST' });
  },

  async listar(): Promise<Usuario[]> {
    return solicitar<Usuario[]>('/api/usuarios');
  },

  async cambiarEstado(id: number, estado: 'Activo' | 'Inactivo'): Promise<Usuario> {
    return solicitar<Usuario>(`/api/usuarios/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    });
  },
};

export const productosApi = {
  async listar(): Promise<Producto[]> {
    const datos = await solicitar<ProductoApi[]>('/api/productos');
    return datos.map(desdeProductoApi);
  },

  async crear(producto: Producto): Promise<Producto> {
    const datos = await solicitar<ProductoApi>('/api/productos', {
      method: 'POST',
      body: JSON.stringify(haciaProductoApi(producto)),
    });
    return desdeProductoApi(datos);
  },

  async actualizar(codigo: string, producto: Producto): Promise<Producto> {
    const datos = await solicitar<ProductoApi>(`/api/productos/${encodeURIComponent(codigo)}`, {
      method: 'PUT',
      body: JSON.stringify(haciaProductoApi(producto)),
    });
    return desdeProductoApi(datos);
  },

  async reabastecer(codigo: string, cantidad = 1): Promise<Producto> {
    const datos = await solicitar<ProductoApi>(`/api/productos/${encodeURIComponent(codigo)}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ cantidad }),
    });
    return desdeProductoApi(datos);
  },

  async eliminar(codigo: string): Promise<void> {
    await solicitar<void>(`/api/productos/${encodeURIComponent(codigo)}`, { method: 'DELETE' });
  },
};

export const pedidosApi = {
  async crear(usuarioId: number, items: { productoCodigo: string; cantidad: number }[]): Promise<Pedido> {
    return solicitar<Pedido>('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify({ usuarioId, items }),
    });
  },

  async mios(usuarioId: number): Promise<Pedido[]> {
    return solicitar<Pedido[]>(`/api/pedidos/usuario/${usuarioId}`);
  },

  async todos(): Promise<Pedido[]> {
    return solicitar<Pedido[]>('/api/pedidos');
  },

  async buscarPorCodigo(codigo: string): Promise<Pedido> {
    return solicitar<Pedido>(`/api/pedidos/codigo/${encodeURIComponent(codigo)}`);
  },

  async actualizarEstado(id: number, estado: string): Promise<Pedido> {
    return solicitar<Pedido>(`/api/pedidos/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  },
};

export const notificacionesApi = {
  async listarPorUsuario(usuarioId: number): Promise<Notificacion[]> {
    return solicitar<Notificacion[]>(`/api/notificaciones/usuario/${usuarioId}`);
  },

  async contarNoLeidas(usuarioId: number): Promise<number> {
    const datos = await solicitar<{ cantidad: number }>(`/api/notificaciones/usuario/${usuarioId}/no-leidas`);
    return datos.cantidad;
  },

  async marcarLeida(id: number, usuarioId: number): Promise<Notificacion> {
    return solicitar<Notificacion>(`/api/notificaciones/${id}/leer?usuarioId=${usuarioId}`, {
      method: 'PUT',
    });
  },

  async marcarTodasLeidas(usuarioId: number): Promise<void> {
    await solicitar<void>(`/api/notificaciones/usuario/${usuarioId}/leer-todas`, {
      method: 'PUT',
    });
  },
};
