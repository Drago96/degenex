import { ReactNode } from "react";

type PaperProps = { children: ReactNode };

export default function Paper({ children }: PaperProps) {
  return (
    <div className="inline-block min-w-[50%] rounded bg-primary p-20 dark:bg-primary-dark">
      {children}
    </div>
  );
}
