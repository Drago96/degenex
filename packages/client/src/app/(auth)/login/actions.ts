"use server";

import { appFetch } from "@/lib/app-fetch";
import { AuthResponseDto } from "@/types/auth/auth-response.dto";
import { AuthDto } from "@/types/auth/auth.dto";
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
