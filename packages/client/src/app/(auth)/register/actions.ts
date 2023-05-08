"use server";

import { RegisterDto } from "./register-schema";

export async function registerUser(registerDto: RegisterDto) {
  console.log("Hello from the server side", registerDto);
}
