import type { InputHTMLAttributes } from 'react';
import Entrada from '../atoms/Input';

type PropiedadesCampoFormulario = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'name' | 'value'
> & {
  etiqueta: string;
  nombre: string;
  valor: string;
  alCambiarValor: (valor: string) => void;
  error?: string;
};

export default function CampoFormulario({
  etiqueta,
  nombre,
  valor,
  alCambiarValor,
  error,
  ...propiedades
}: PropiedadesCampoFormulario) {
  return (
    <div className="campo">
      <label htmlFor={nombre}>{etiqueta}</label>

      <Entrada
        id={nombre}
        name={nombre}
        value={valor}
        alCambiarValor={alCambiarValor}
        tieneError={Boolean(error)}
        aria-describedby={error ? `${nombre}-error` : undefined}
        {...propiedades}
      />

      {error && (
        <small id={`${nombre}-error`} className="error-campo">
          {error}
        </small>
      )}
    </div>
  );
}
