import { HTMLProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ErrorMessageProps = {
  children: ReactNode;
} & HTMLProps<HTMLDivElement>;

export default function ErrorMessage({
  children,
  className,
  ...props
}: ErrorMessageProps) {
  return (
    <div
      className={twMerge("text-error dark:text-error-dark", className)}
      {...props}
    >
      {children}
    </div>
  );
}
