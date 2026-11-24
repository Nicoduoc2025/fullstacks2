import type { InputHTMLAttributes } from 'react';

interface PropiedadesCampo extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta: string;
}

export default function Campo({ etiqueta, ...propiedades }: PropiedadesCampo) {
  return (
    <label className="campo">
      <span>{etiqueta}</span>
      <input {...propiedades} />
    </label>
  );
}
