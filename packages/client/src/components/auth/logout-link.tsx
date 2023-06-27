"use client";

import { ButtonHTMLAttributes, forwardRef, Ref, useTransition } from "react";
import { twMerge } from "tailwind-merge";

import { logoutUser } from "@/app/actions";
import LinkButton from "../common/link-button";

type LogoutLinkProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function LogoutLink(
  { className, ...props }: LogoutLinkProps,
  ref: Ref<HTMLButtonElement>
) {
  const [isLogoutPending, startLogoutTransition] = useTransition();

  return (
    <LinkButton
      {...props}
      className={twMerge("w-full text-left", className)}
      disabled={isLogoutPending}
      onClick={() => startLogoutTransition(async () => await logoutUser())}
      ref={ref}
    >
      Logout
    </LinkButton>
  );
}

export default forwardRef(LogoutLink);
