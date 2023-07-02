"use server";

import Stripe from "stripe";

import { appFetch } from "@/lib/app-fetch";

export async function createCheckoutSession() {
  const response = await appFetch<Stripe.Checkout.Session>("deposits", {
    method: "POST",
    body: { currency: "usd", amount: 100 },
  });

  return response.data;
}
