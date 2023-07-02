"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";

import Button from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { stripePromise } from "@/lib/stripe-promise";
import { createCheckoutSession } from "./actions";

const showDepositError = () =>
  toast.error("There was an issue with your deposit");

export default function Wallet() {
  const [isDepositPending, startDepositTransition] = useTransition();

  return (
    <div className="flex flex-col gap-5 lg:gap-20">
      <div className="flex flex-col gap-5">
        <Typography variant="h2" className="text-3xl font-bold lg:text-5xl">
          Wallet
        </Typography>
        <div className="flex flex-row gap-5">
          <Button
            disabled={isDepositPending}
            onClick={() => {
              startDepositTransition(async () => {
                const stripe = await stripePromise;

                if (!stripe) {
                  showDepositError();

                  return;
                }

                const checkoutSession = await createCheckoutSession();

                if (!checkoutSession) {
                  showDepositError();

                  return;
                }

                const { error } = await stripe.redirectToCheckout({
                  sessionId: checkoutSession.id,
                });

                if (error) {
                  showDepositError();
                }
              });
            }}
          >
            Deposit
          </Button>
        </div>
      </div>
    </div>
  );
}
