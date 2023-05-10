"use client";

import { ReactNode } from "react";

type IconButtonProps = { children: ReactNode; onClick: () => void };

export default function IconButton({ children, onClick }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-none px-4 py-2 text-primary-contrastText dark:text-primary-contrastText-dark"
    >
      {children}
    </button>
  );
}
