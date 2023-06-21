import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames(
        "rounded bg-secondary px-4 py-2 text-secondary-contrastText disabled:bg-secondary-disabled",
        className
      )}
    >
      {children}
    </button>
  );
}
