import { ReactNode } from "react";

type IconButtonProps = { children: ReactNode; onClick: () => void };

export default function IconButton({ children, onClick }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-none px-4 py-2 text-black dark:text-white"
    >
      {children}
    </button>
  );
}
