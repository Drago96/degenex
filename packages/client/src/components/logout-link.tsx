"use client";

import { logoutUser } from "@/app/actions";
import { useTransition } from "react";
import LinkButton from "./common/link-button";

export default function LogoutLink() {
  const [isLogoutPending, startLogoutTransition] = useTransition();

  return (
    <LinkButton
      disabled={isLogoutPending}
      onClick={() => startLogoutTransition(async () => await logoutUser())}
    >
      Logout
    </LinkButton>
  );
}
