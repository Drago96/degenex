"use server";

import { appFetch } from "../../../lib/app-fetch";
import { AuthDto } from "./auth.dto";

export async function sendVerificationCode({ email }: AuthDto) {
  return await appFetch("auth/send-verification-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
