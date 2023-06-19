import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

type LinkButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LinkButton({
  children,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <button
      {...props}
      className={classNames(
        "mr-2 px-4 py-2 text-primary-contrastText focus:outline-none dark:text-primary-contrastText-dark",
        className
      )}
    >
      {children}
    </button>
  );
}
