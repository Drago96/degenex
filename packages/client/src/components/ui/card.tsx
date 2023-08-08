import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = { children: ReactNode; className?: string };

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={twMerge(
        "inline-block rounded bg-primary p-2 dark:bg-primary-dark",
        className,
      )}
    >
      {children}
    </div>
  );
}
