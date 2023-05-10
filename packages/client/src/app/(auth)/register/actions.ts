"use server";

import { RegisterDto } from "./register-schema";

export async function registerUser(registerDto: RegisterDto) {
  const wait = () =>
    new Promise((res, rej) => setTimeout(() => res(null), 1000));

  await wait();

  return "Test response";
}
