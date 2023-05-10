import NextLink, { LinkProps } from "next/link";
import { ReactNode } from "react";

type AppLinkProps = { children: ReactNode } & LinkProps;

export default function Link({ children, ...props }: AppLinkProps) {
  return (
    <NextLink
      {...props}
      className="mr-2 px-4 py-2 text-primary-contrastText focus:outline-none dark:text-primary-contrastText-dark"
    >
      {children}
    </NextLink>
  );
}
