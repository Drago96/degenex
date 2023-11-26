"use server";

import { StripePaymentDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import { Deposit } from "@prisma/client";
import { getCurrentUser } from "@/services/users.service";

export async function createDeposit({ currency, amount }: StripePaymentDto) {
  const currentUser = await getCurrentUser();

  return appFetch<Deposit, StripePaymentDto>(
    `users/${currentUser?.id}/deposits`,
    {
      method: "POST",
      body: { currency, amount },
    },
  );
}
