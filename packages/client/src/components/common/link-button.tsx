import { ButtonHTMLAttributes, ReactNode } from "react";

type LinkButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LinkButton({ children, ...props }: LinkButtonProps) {
  return (
    <button
      className="mr-2 px-4 py-2 text-primary-contrastText focus:outline-none dark:text-primary-contrastText-dark"
      {...props}
    >
      {children}
    </button>
  );
}
