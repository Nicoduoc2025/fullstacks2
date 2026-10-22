import type { InputHTMLAttributes } from 'react';

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onValueChange: (value: string) => void;
  hasError?: boolean;
};

export default function Input({
  onValueChange,
  hasError = false,
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      className={`${className} ${hasError ? 'input-error' : ''}`.trim()}
      aria-invalid={hasError}
      onChange={(e) => onValueChange(e.target.value)}
      {...props}
    />
    
  );
}