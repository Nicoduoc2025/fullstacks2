import type { InputHTMLAttributes } from 'react';
import Input from '../atoms/Input';

type FormFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  label: string;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
};

export default function FormField({
  label,
  name,
  value,
  onValueChange,
  error,
  ...props
}: FormFieldProps) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>

      <Input
        id={name}
        name={name}
        value={value}
        onValueChange={onValueChange}
        hasError={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />

      {error && (
        <small id={`${name}-error`} className="field-error">
          {error}
        </small>
      )}
    </div>
  );
}