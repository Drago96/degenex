"use server";

import { SendVerificationCodeDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";

export async function sendVerificationCode({ email }: SendVerificationCodeDto) {
  return await appFetch("auth/send-verification-code", {
    method: "POST",
    body: { email },
  });
}
