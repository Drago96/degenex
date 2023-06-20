"use server";

import { AuthResponseDto, RegisterDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import { setAccessToken } from "@/services/auth.service";

export async function registerUser({
  email,
  password,
  verificationCode,
}: RegisterDto) {
  const response = await appFetch<AuthResponseDto>("auth/register", {
    method: "POST",
    body: { email, password, verificationCode },
  });

  if (response.isSuccess) {
    const { accessToken } = response.data;

    setAccessToken(accessToken);
  }

  return response;
}
