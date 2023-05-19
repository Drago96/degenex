"use server";

import { RegisterDto } from "./register.dto";

export async function registerUser({
  email,
  password,
  verificationCode,
}: RegisterDto) {
  await fetch(`${process.env.API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, verificationCode }),
  });
}
