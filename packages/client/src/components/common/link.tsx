import classNames from "classnames";
import NextLink, { LinkProps } from "next/link";
import { ReactNode } from "react";

type AppLinkProps = { children: ReactNode; className?: string } & LinkProps;

export default function Link({ children, className, ...props }: AppLinkProps) {
  return (
    <NextLink
      prefetch={false}
      {...props}
      className={classNames(
        "mr-2 px-4 py-2 text-primary-contrastText focus:outline-none dark:text-primary-contrastText-dark",
        className
      )}
    >
      {children}
    </NextLink>
  );
}
