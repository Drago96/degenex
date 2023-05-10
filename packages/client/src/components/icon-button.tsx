import { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ children, ...props }: IconButtonProps) {
  return (
    <button
      className="bg-none px-4 py-2 text-primary-contrastText dark:text-primary-contrastText-dark"
      {...props}
    >
      {children}
    </button>
  );
}
