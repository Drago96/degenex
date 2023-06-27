import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ErrorMessageProps = {
  children: ReactNode;
  className?: string;
};

export default function ErrorMessage({
  children,
  className,
}: ErrorMessageProps) {
  return (
    <div className={twMerge("text-error dark:text-error-dark", className)}>
      {children}
    </div>
  );
}
