"use server";

import { AuthDto } from "./auth.dto";

export async function sendVerificationCode(authDto: AuthDto) {
  await fetch(`${process.env.API_BASE_URL}/api/auth/send-verification-code`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: authDto.email }),
  });
}
