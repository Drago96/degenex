"use server";

import Stripe from "stripe";

import { StripePaymentDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";

export async function createCheckoutSession() {
  const response = await appFetch<Stripe.Checkout.Session, StripePaymentDto>(
    "deposits",
    {
      method: "POST",
      body: { currency: "USD", amount: 100 },
    }
  );

  return response.data;
}
