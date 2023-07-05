"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";

import { ALLOWED_CURRENCIES, StripePaymentSchema } from "@degenex/common";
import { createFormServerAction } from "@/lib/create-form-server-action";
import { stripePromise } from "@/lib/stripe-promise";
import { createDeposit } from "@/app/(user-profile)/wallet/@modal/(.)deposit/actions";
import Input from "../ui/input";
import SubmitButton from "../ui/submit-button";
import ErrorMessage from "../ui/error-message";
import Select from "../ui/select";
import Typography from "../ui/typography";

type Variant = "page" | "modal";

type DepositFormProps = {
  variant?: Variant;
};

export default function DepositForm({ variant = "page" }: DepositFormProps) {
  const {
    register,
    trigger,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(StripePaymentSchema),
    mode: "onTouched",
  });

  const formAction = createFormServerAction({
    serverAction: createDeposit,
    validateForm: trigger,
    setFormError: setError,
    onSuccess: async (deposit) => {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("root", { message: "There was an issue with your deposit" });

        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: deposit.sessionId,
      });

      if (error) {
        setError("root", { message: error.message });

        return;
      }
    },
  });

  return (
    <form
      className={classNames("flex flex-col", {
        "gap-7": variant === "page",
        "gap-3": variant === "modal",
      })}
      action={formAction}
    >
      <Typography
        className={classNames("text-center", {
          "text-5xl": variant === "page",
          "text-3xl": variant === "modal",
        })}
        variant="h1"
      >
        Deposit
      </Typography>
      {errors.root && (
        <ErrorMessage className="text-center">
          {errors.root.message}
        </ErrorMessage>
      )}
      <div className="flex flex-row gap-3">
        <Input
          type="number"
          label="Amount"
          errors={errors}
          placeholder="Enter 10-100000"
          autoFocus
          containerProps={{
            className: "grow",
          }}
          {...register("amount", { valueAsNumber: true })}
        />
        <Select
          options={ALLOWED_CURRENCIES}
          errors={errors}
          containerProps={{
            className: "w-1/4",
          }}
          {...register("currency")}
        />
      </div>
      <SubmitButton>Deposit</SubmitButton>
    </form>
  );
}
