"use server";

import { cookies } from "next/headers";
import moment from "moment";

import { appFetch } from "@/lib/app-fetch";
import { AuthResponseDto } from "@/types/auth/auth-response.dto";
import { AuthDto } from "@/types/auth/auth.dto";

export async function loginUser({ email, password }: AuthDto) {
  const response = await appFetch<AuthResponseDto>("auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.isSuccess) {
    const { accessToken } = response.data;
    const cookieStore = cookies();

    cookieStore.set("access-token", accessToken, {
      httpOnly: true,
      secure: true,
      expires: moment().add(7, "days").toDate(),
    });
  }

  return response;
}
