"use server";

import { appFetch } from "../../../../lib/app-fetch";
import { RegisterDto } from "./register.dto";

export async function registerUser({
  email,
  password,
  verificationCode,
}: RegisterDto) {
  return await appFetch(`${process.env.API_BASE_URL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, password, verificationCode }),
  });
}
