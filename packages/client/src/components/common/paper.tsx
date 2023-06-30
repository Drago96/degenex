import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type PaperProps = { children: ReactNode; className?: string };

export default function Paper({ children, className }: PaperProps) {
  return (
    <div
      className={twMerge(
        "inline-block min-w-[600px] max-w-[1200px] rounded bg-primary px-4 py-8 dark:bg-primary-dark lg:p-16",
        className
      )}
    >
      {children}
    </div>
  );
}
