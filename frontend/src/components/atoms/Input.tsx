import type { InputHTMLAttributes } from 'react';

type PropiedadesEntrada = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  alCambiarValor: (valor: string) => void;
  tieneError?: boolean;
};

export default function Entrada({
  alCambiarValor,
  tieneError = false,
  className = '',
  ...propiedades
}: PropiedadesEntrada) {
  return (
    <input
      className={`${className} ${tieneError ? 'entrada-error' : ''}`.trim()}
      aria-invalid={tieneError}
      onChange={(evento) => alCambiarValor(evento.target.value)}
      {...propiedades}
    />
  );
}
