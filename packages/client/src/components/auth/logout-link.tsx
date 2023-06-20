"use client";

import { useTransition } from "react";

import { logoutUser } from "@/app/actions";
import LinkButton from "../common/link-button";

export default function LogoutLink() {
  const [isLogoutPending, startLogoutTransition] = useTransition();

  return (
    <LinkButton
      className="w-full text-left"
      disabled={isLogoutPending}
      onClick={() => startLogoutTransition(async () => await logoutUser())}
    >
      Logout
    </LinkButton>
  );
}
