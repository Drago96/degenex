"use server";

import { RegisterDto } from "./schema";

export async function registerUser(registerDto: RegisterDto) {
  console.log("Hello from the server side", registerDto);
}
