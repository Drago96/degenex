"use client";

import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { find } from "lodash";

import { VERIFICATION_CODE_LENGTH } from "@degenex/common";
import Paper from "@/components/ui/paper";
import Typography from "@/components/ui/typography";
import Input from "@/components/ui/input";
import { useRegisterCredentials } from "@/components/auth/register-credentials-provider";
import ClientRenderedRoute from "@/components/client-rendered-route";
import { createFormServerAction } from "@/lib/create-form-server-action";
import { useClientAction } from "@/hooks/use-client-action";
import { registerUser } from "./actions";

const ERROR_TOAST_ID = "confirm-verification-code/error";
const REDIRECT_TOAST_ID = "confirm-verification-code/redirect";

function ConfirmVerificationCode() {
  const { registerCredentials } = useRegisterCredentials();
  const { control, setFocus, reset, getValues } = useForm();
  const [isVerificationPending, startVerificationTransition] = useTransition();
  const { push } = useRouter();
  const redirectToHome = useClientAction(() => push("/"));

  if (!registerCredentials) {
    toast.warn("Please input your account credentials first.", {
      toastId: REDIRECT_TOAST_ID,
    });

    redirect("/register");
  }

  const registerUserAction = createFormServerAction({
    serverAction: registerUser,
    onSuccess: async () => {
      toast.dismiss(ERROR_TOAST_ID);

      toast.success("Verification successful");

      redirectToHome();
    },
    onError: async (error) => {
      if (toast.isActive(ERROR_TOAST_ID)) {
        toast.update(ERROR_TOAST_ID);
      } else {
        toast.error(error, { toastId: ERROR_TOAST_ID });
      }

      reset();
    },
  });

  return (
    <div className="flex justify-center">
      <Paper>
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Typography className="text-center text-4xl" variant="h1">
              Verify your email
            </Typography>
            <Typography className="text-center">
              We&apos;ve sent a verification code to{" "}
              <Typography variant="span" className="font-bold">
                {registerCredentials.email}
              </Typography>
              . Please use it to verify your email.
            </Typography>
          </div>
          <div className="flex flex-row justify-center gap-3">
            {[...Array(VERIFICATION_CODE_LENGTH)].map((_, index) => {
              return (
                <Controller
                  key={index}
                  control={control}
                  name={`verificationCode[${index}]`}
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <Input
                      autoFocus={index === 0}
                      key={index}
                      type="tel"
                      value={value || ""}
                      disabled={isVerificationPending}
                      className="max-w-[40px] text-center"
                      onChange={async (event) => {
                        const newValue =
                          find(
                            event.currentTarget.value,
                            (inputValue) => inputValue !== value
                          ) || value;

                        if (!/\d/.test(newValue)) {
                          return;
                        }

                        onChange(newValue);

                        const isLastCodeCharacter =
                          index === VERIFICATION_CODE_LENGTH - 1;

                        if (!isLastCodeCharacter) {
                          setFocus(`verificationCode[${index + 1}]`);

                          return;
                        }

                        const verificationCodeCharacters: string[] =
                          getValues("verificationCode");

                        const isVerificationCodeIncomplete =
                          verificationCodeCharacters.some(
                            (codeCharacter) => codeCharacter === undefined
                          );

                        if (isVerificationCodeIncomplete) {
                          return;
                        }

                        const verificationCode =
                          verificationCodeCharacters.join("");

                        startVerificationTransition(async () => {
                          await registerUserAction({
                            ...registerCredentials,
                            verificationCode,
                          });
                        });
                      }}
                      {...fieldProps}
                    />
                  )}
                />
              );
            })}
          </div>
        </form>
      </Paper>
    </div>
  );
}

export default ClientRenderedRoute(ConfirmVerificationCode);
