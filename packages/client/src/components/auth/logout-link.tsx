"use client";

import { forwardRef, Ref, useTransition } from "react";

import { logoutUser } from "@/app/actions";
import LinkButton from "../common/link-button";

function LogoutLink(_props: object, ref: Ref<HTMLButtonElement>) {
  const [isLogoutPending, startLogoutTransition] = useTransition();

  return (
    <LinkButton
      className="w-full text-left"
      disabled={isLogoutPending}
      ref={ref}
      onClick={() => startLogoutTransition(async () => await logoutUser())}
    >
      Logout
    </LinkButton>
  );
}

export default forwardRef(LogoutLink);
