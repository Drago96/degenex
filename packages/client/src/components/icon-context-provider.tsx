"use client";

import { ReactNode } from "react";
import { IconContext } from "react-icons";

type IconContextProviderProps = { children: ReactNode };

export default function IconContextProvider({
  children,
}: IconContextProviderProps) {
  return (
    <IconContext.Provider value={{ size: "24" }}>
      {children}
    </IconContext.Provider>
  );
}
