import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Field({ label, ...props }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
  
}