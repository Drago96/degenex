import classNames from "classnames";
import { ReactNode } from "react";

type PaperProps = { children: ReactNode; className?: string };

export default function Paper({ children, className }: PaperProps) {
  return (
    <div
      className={classNames(
        "inline-block min-w-[50%] rounded bg-primary p-20 dark:bg-primary-dark",
        className
      )}
    >
      {children}
    </div>
  );
}
