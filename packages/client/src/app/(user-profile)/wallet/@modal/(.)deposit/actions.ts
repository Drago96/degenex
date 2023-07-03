"use server";

import Stripe from "stripe";

import { StripePaymentDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";

export async function createCheckoutSession({
  currency,
  amount,
}: StripePaymentDto) {
  return appFetch<Stripe.Checkout.Session, StripePaymentDto>("deposits", {
    method: "POST",
    body: { currency, amount: Number(amount) },
  });
}
