import { ReactNode } from "react";

type PaperProps = { children: ReactNode };

export default function Paper({ children }: PaperProps) {
  return (
    <div className="inline-block min-w-[50%] rounded bg-gray-100 p-20 dark:bg-gray-800">
      {children}
    </div>
  );
}
