import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        "rounded bg-secondary px-4 py-2 text-secondary-contrastText disabled:bg-secondary-disabled",
        className
      )}
    >
      {children}
    </button>
  );
}
