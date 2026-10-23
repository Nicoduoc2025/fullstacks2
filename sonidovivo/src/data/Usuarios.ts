import type { User } from '../types';

export const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin_general',
    email: 'admin@sonidovivo.cl',
    password: 'admin123',
    role: 'ADMIN',
    status: 'Activo',
  },
  {
    id: 2,
    username: 'vendedor_vina',
    email: 'vendedor1@sonidovivo.cl',
    password: 'vendedor123',
    role: 'VENDEDOR',
    status: 'Activo',
  },
  {
    id: 3,
    username: 'cliente_demo',
    email: 'cliente@gmail.com',
    password: 'cliente123',
    role: 'CLIENTE',
    status: 'Activo',
  },
];