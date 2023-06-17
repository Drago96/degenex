"use server";

import { cookies } from "next/headers";
import moment from "moment";

import { appFetch } from "@/lib/app-fetch";
import { AuthResponseDto } from "@/types/auth/auth-response.dto";
import { RegisterDto } from "@/types/auth/register.dto";

export async function registerUser({
  email,
  password,
  verificationCode,
}: RegisterDto) {
  const response = await appFetch<AuthResponseDto>("auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, verificationCode }),
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
