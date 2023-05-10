import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="rounded bg-secondary px-4 py-2 text-secondary-contrastText disabled:bg-secondary-disabled"
      {...props}
    >
      {children}
    </button>
  );
}
