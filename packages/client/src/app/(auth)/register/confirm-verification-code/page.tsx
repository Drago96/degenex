"use client";

import { redirect } from "next/navigation";
import { toast } from "react-toastify";

import { useRegisterCredentials } from "../register-credentials-provider";
import Loading from "../../../loading";
import { useIsHydrated } from "../../../../hooks/use-is-hydrated";

export default function ConfirmVerificationCode() {
  const isHydrated = useIsHydrated();
  const { registerCredentials } = useRegisterCredentials();

  if (!isHydrated) {
    return <Loading />;
  }

  if (!registerCredentials) {
    toast.warn("Please input your account credentials first.", {
      toastId: "confirm-verification-code/redirect",
    });

    redirect("register");
  }

  return null;
}
