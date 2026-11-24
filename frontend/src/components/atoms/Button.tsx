import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export default function Boton({
  children: contenido,
  className = '',
  ...propiedades
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={`boton ${className}`} {...propiedades}>
      {contenido}
    </button>
  );
}
