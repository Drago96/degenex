"use server";

import { appFetch } from "../../../lib/app-fetch";
import { AuthDto } from "./auth.dto";

export async function sendVerificationCode({ email }: AuthDto) {
  return await appFetch(
    `${process.env.API_BASE_URL}/api/auth/send-verification-code`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );
}
