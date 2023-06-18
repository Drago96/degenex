"use server";

import { appFetch } from "@/lib/app-fetch";
import { AuthDto } from "@/types/auth/auth.dto";

export async function sendVerificationCode({ email }: AuthDto) {
  return await appFetch("auth/send-verification-code", {
    method: "POST",
    body: { email },
  });
}
