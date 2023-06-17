"use client";

import { useRouter } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import { useRegisterCredentials } from "@/components/auth/register-credentials-provider";
import { sendVerificationCode } from "./actions";

export default function Register() {
  const { setRegisterCredentials } = useRegisterCredentials();
  const { push } = useRouter();

  return (
    <AuthForm
      variant="Register"
      submitAction={sendVerificationCode}
      onSuccess={async (registerCredentials) => {
        setRegisterCredentials(registerCredentials);

        push("register/confirm-verification-code");
      }}
    />
  );
}
