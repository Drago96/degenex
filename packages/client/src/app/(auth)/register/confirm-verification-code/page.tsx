"use client";

import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { find } from "lodash";

import { VERIFICATION_CODE_LENGTH } from "@degenex/common";
import { useRegisterCredentials } from "../register-credentials-provider";
import Loading from "../../../loading";
import { useIsHydrated } from "../../../../hooks/use-is-hydrated";
import Paper from "../../../../components/paper";
import Typography from "../../../../components/typography";
import Input from "../../../../components/input";
import { registerUser } from "./actions";

export default function ConfirmVerificationCode() {
  const isHydrated = useIsHydrated();
  const { registerCredentials } = useRegisterCredentials();
  const { control, setFocus, reset, getValues } = useForm();

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

                        if (
                          verificationCodeCharacters.some(
                            (codeCharacter) => codeCharacter === undefined
                          )
                        ) {
                          return;
                        }

                        const verificationCode =
                          verificationCodeCharacters.join("");

                        // Register User

                        reset();
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
