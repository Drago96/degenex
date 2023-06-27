import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type IconButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  children,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        "bg-none px-4 py-2 text-primary-contrastText dark:text-primary-contrastText-dark",
        className
      )}
    >
      {children}
    </button>
  );
}
