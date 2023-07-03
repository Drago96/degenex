import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ALLOWED_CURRENCIES, StripePaymentSchema } from "@degenex/common";
import { createFormServerAction } from "@/lib/create-form-server-action";
import { stripePromise } from "@/lib/stripe-promise";
import { createCheckoutSession } from "@/app/(user-profile)/wallet/@modal/(.)deposit/actions";
import Input from "../ui/input";
import SubmitButton from "../ui/submit-button";
import ErrorMessage from "../ui/error-message";
import Select from "../ui/select";

export default function DepositForm() {
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
    serverAction: createCheckoutSession,
    validateForm: trigger,
    setFormError: setError,
    onSuccess: async (checkoutSession) => {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("root", { message: "There was an issue with your deposit" });

        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (error) {
        setError("root", { message: error.message });

        return;
      }
    },
  });

  return (
    <form className="flex flex-col gap-3" action={formAction}>
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
