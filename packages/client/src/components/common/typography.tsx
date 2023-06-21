import classNames from "classnames";
import { createElement, ReactNode } from "react";

type Variant = "p" | "div" | "span" | "h1" | "h2" | "h3" | "h4";

type TypographyProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export default function Typography({
  children,
  className,
  variant = "p",
}: TypographyProps) {
  return createElement(
    variant,
    {
      className: classNames(
        "text-primary-contrastText dark:text-primary-contrastText-dark",
        className
      ),
    },
    children
  );
}
