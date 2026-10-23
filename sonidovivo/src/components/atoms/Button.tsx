import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export default function Button({
  children,
  className = '',
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={`button ${className}`} {...props}>
      {children}
    </button>
  );
  
}