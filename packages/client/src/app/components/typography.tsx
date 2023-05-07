import { ReactNode } from "react";

type TypographyProps = { children: ReactNode };

export default function Typography({ children }: TypographyProps) {
  return <div className="dark:text-white">{children}</div>;
}
