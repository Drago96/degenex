import classNames from "classnames";
import { ReactNode } from "react";

type CardProps = { children: ReactNode; className?: string };

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={classNames(
        "inline-block rounded bg-primary p-2 dark:bg-primary-dark",
        className
      )}
    >
      {children}
    </div>
  );
}
