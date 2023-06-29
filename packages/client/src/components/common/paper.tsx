import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type PaperProps = { children: ReactNode; className?: string };

export default function Paper({ children, className }: PaperProps) {
  return (
    <div
      className={twMerge(
        "inline-block w-full max-w-[600px] rounded bg-primary p-[calc(30px+1.5625vw)] dark:bg-primary-dark",
        className
      )}
    >
      {children}
    </div>
  );
}
