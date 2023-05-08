"use server";

import { RegisterDto } from "./register-schema";

export async function registerUser(registerDto: RegisterDto) {
  const wait = () =>
    new Promise((res, rej) => setTimeout(() => res(null), 5000));

  await wait();

  console.log("Finished waiting...");
}
