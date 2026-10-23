export type Role = 'CLIENTE' | 'VENDEDOR' | 'ADMIN';

export type Product = {
  Codigo: string;
  Categoria: string;
  Nombre: string;
  Marca: string;
  Modelo: string;
  Stock: number;
  Precio: number;
  Imagen: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  role: Role;
  status: 'Activo' | 'Inactivo';
};