import { twMerge } from "tailwind-merge";
import NextLink, { LinkProps } from "next/link";
import { ReactNode, Ref, forwardRef } from "react";

type Variant = "link" | "button";

const DEFAULT_CLASS_NAME_BY_VARIANT: Record<Variant, string> = {
  link: "text-primary-contrastText focus:outline-none dark:text-primary-contrastText-dark",
  button: "rounded bg-secondary px-4 py-2 text-secondary-contrastText",
};

type AppLinkProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
} & LinkProps;

function Link(
  { children, className, variant = "link", ...props }: AppLinkProps,
  ref: Ref<HTMLAnchorElement>
) {
  return (
    <NextLink
      {...props}
      className={twMerge(DEFAULT_CLASS_NAME_BY_VARIANT[variant], className)}
      ref={ref}
    >
      {children}
    </NextLink>
  );
}

export default forwardRef(Link);
