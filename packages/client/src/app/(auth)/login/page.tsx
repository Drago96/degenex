"use client";

import { useRouter } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import { loginUser } from "./actions";

export default function Login() {
  const { push } = useRouter();

  return (
    <AuthForm
      variant="Log in"
      submitAction={loginUser}
      onSuccess={async () => {
        push("/");
      }}
    />
  );
}
