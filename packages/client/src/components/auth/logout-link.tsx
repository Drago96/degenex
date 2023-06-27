"use client";

import {
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
  Ref,
  useTransition,
} from "react";
import { twMerge } from "tailwind-merge";

import { logoutUser } from "@/app/actions";
import LinkButton from "../common/link-button";

type LogoutLinkProps = {
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function LogoutLink(
  { className, children, disabled, onClick, ...props }: LogoutLinkProps,
  ref: Ref<HTMLButtonElement>
) {
  const [isLogoutPending, startLogoutTransition] = useTransition();

  return (
    <LinkButton
      {...props}
      className={twMerge("w-full text-left", className)}
      disabled={isLogoutPending || disabled}
      onClick={(event) => {
        startLogoutTransition(async () => await logoutUser());

        if (onClick) {
          onClick(event);
        }
      }}
      ref={ref}
    >
      {children}
    </LinkButton>
  );
}

export default forwardRef(LogoutLink);
