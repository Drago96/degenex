"use client";

import { redirect } from "next/navigation";
import { toast } from "react-toastify";

import { useRegisterCredentials } from "../register-credentials-provider";
import Loading from "../../../loading";
import { useIsHydrated } from "../../../../hooks/use-is-hydrated";
import Paper from "../../../../components/paper";
import Typography from "../../../../components/typography";

export default function ConfirmVerificationCode() {
  const isHydrated = useIsHydrated();
  const { registerCredentials } = useRegisterCredentials();

  if (!isHydrated) {
    return <Loading />;
  }

  if (!registerCredentials) {
    toast.warn("Please input your account credentials first.", {
      toastId: "confirm-verification-code/redirect",
    });

    redirect("register");
  }

  return (
    <div className="flex justify-center">
      <Paper>
        <form>
          <div className="flex flex-col gap-3">
            <Typography className="text-center text-4xl" variant="h1">
              Verify your email
            </Typography>
            <Typography>
              We&apos;ve sent a verification code to{" "}
              <Typography variant="span" className="font-bold">
                {registerCredentials.email}
              </Typography>
              . Please use it to verify your email.
            </Typography>
          </div>
        </form>
      </Paper>
    </div>
  );
}
