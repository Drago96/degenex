"use server";

import { AuthDto, AuthResponseDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import { setAccessToken } from "@/services/auth.service";

export async function loginUser({ email, password }: AuthDto) {
  const response = await appFetch<AuthResponseDto>("auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (response.isSuccess) {
    const { accessToken } = response.data;

    setAccessToken(accessToken);
  }

  return response;
}
