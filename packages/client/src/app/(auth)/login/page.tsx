"use client";

import { useRouter } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import { useClientAction } from "@/hooks/use-client-action";
import { loginUser } from "./actions";

export default function Login() {
  const { push } = useRouter();
  const redirectToHome = useClientAction(() => push("/"));

  return (
    <AuthForm
      variant="Log in"
      submitAction={loginUser}
      onSuccess={async () => {
        redirectToHome();
      }}
    />
  );
}
