"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import { AuthSchema } from "@degenex/common";
import Input from "@/components/input";
import Paper from "@/components/paper";
import Typography from "@/components/typography";
import { sendVerificationCode } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import ErrorMessage from "@/components/error-message";
import { createFormServerAction } from "@/lib/create-form-server-action";
import { useToggle } from "@/hooks/use-toggle";
import IconButton from "@/components/icon-button";
import { useRegisterCredentials } from "./register-credentials-provider";

export default function Register() {
  const {
    register,
    trigger,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(AuthSchema),
    mode: "onTouched",
  });

  const { setRegisterCredentials } = useRegisterCredentials();
  const [isPasswordVisible, togglePasswordVisibility] = useToggle();
  const { push } = useRouter();

  const sendVerificationCodeAction = createFormServerAction({
    serverAction: sendVerificationCode,
    validateForm: trigger,
    setFormError: setError,
    onSuccess: async (_response, registerCredentials) => {
      setRegisterCredentials(registerCredentials);

      push("register/confirm-verification-code");
    },
  });

  return (
    <div className="flex justify-center">
      <Paper>
        <form
          action={sendVerificationCodeAction}
          className="flex flex-col gap-7"
        >
          <Typography className="text-center text-5xl" variant="h1">
            Register
          </Typography>
          {errors.root && (
            <ErrorMessage className="text-center">
              {errors.root.message}
            </ErrorMessage>
          )}
          <Input
            type="email"
            label="Email"
            errors={errors}
            autoFocus
            {...register("email")}
          />
          <Input
            type={isPasswordVisible ? "text" : "password"}
            label="Password"
            errors={errors}
            endAdornment={
              <IconButton
                type="button"
                tabIndex={-1}
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? <MdVisibilityOff /> : <MdVisibility />}
              </IconButton>
            }
            {...register("password")}
          />
          <SubmitButton>Register</SubmitButton>
        </form>
      </Paper>
    </div>
  );
}
