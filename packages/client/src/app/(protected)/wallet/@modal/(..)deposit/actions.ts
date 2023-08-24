"use server";

import { StripePaymentDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import { Deposit } from "@prisma/client";

export async function createDeposit({ currency, amount }: StripePaymentDto) {
  return appFetch<Deposit, StripePaymentDto>("deposits", {
    method: "POST",
    body: { currency, amount },
  });
}
