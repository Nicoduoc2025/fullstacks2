import type { Usuario } from '../types';

export const usuariosIniciales: Usuario[] = [
  {
    id: 1,
    nombreUsuario: 'admin_general',
    correo: 'admin@sonidovivo.cl',
    contrasena: 'admin123',
    rol: 'ADMIN',
    estado: 'Activo',
  },
  {
    id: 2,
    nombreUsuario: 'vendedor_vina',
    correo: 'vendedor1@sonidovivo.cl',
    contrasena: 'vendedor123',
    rol: 'VENDEDOR',
    estado: 'Activo',
  },
  {
    id: 3,
    nombreUsuario: 'cliente_demo',
    correo: 'cliente@gmail.com',
    contrasena: 'cliente123',
    rol: 'CLIENTE',
    estado: 'Activo',
  },
];
