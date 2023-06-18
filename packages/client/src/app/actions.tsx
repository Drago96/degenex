"use server";

import { clearAuth } from "@/services/auth.service";

export async function logoutUser() {
  clearAuth();
}
