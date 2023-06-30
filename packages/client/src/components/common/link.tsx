import { twMerge } from "tailwind-merge";
import NextLink, { LinkProps } from "next/link";
import { ReactNode, Ref, forwardRef } from "react";

type AppLinkProps = { children: ReactNode; className?: string } & LinkProps;

function Link(
  { children, className, ...props }: AppLinkProps,
  ref: Ref<HTMLAnchorElement>
) {
  return (
    <NextLink
      prefetch={false}
      {...props}
      className={twMerge(
        "text-primary-contrastText focus:outline-none dark:text-primary-contrastText-dark",
        className
      )}
      ref={ref}
    >
      {children}
    </NextLink>
  );
}

export default forwardRef(Link);
