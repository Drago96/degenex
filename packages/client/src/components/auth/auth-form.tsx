"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import { AuthSchema } from "@degenex/common";
import Input from "@/components/common/input";
import Paper from "@/components/common/paper";
import Typography from "@/components/common/typography";
import IconButton from "@/components/common/icon-button";
import SubmitButton from "@/components/common/submit-button";
import ErrorMessage from "@/components/common/error-message";
import { createFormServerAction } from "@/lib/create-form-server-action";
import { useToggle } from "@/hooks/use-toggle";
import { AuthDto } from "@/types/auth/auth.dto";
import { FetchResponse } from "@/lib/app-fetch";

export type AuthFormProps = {
  variant: "Register" | "Log in";
  submitAction: (formData: AuthDto) => Promise<FetchResponse<unknown>>;
  onSuccess: (formData: AuthDto) => Promise<void>;
};

export default function AuthForm({
  variant,
  submitAction,
  onSuccess,
}: AuthFormProps) {
  const {
    register,
    trigger,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(AuthSchema),
    mode: "onTouched",
  });

  const [isPasswordVisible, togglePasswordVisibility] = useToggle();

  const formAction = createFormServerAction({
    serverAction: submitAction,
    validateForm: trigger,
    setFormError: setError,
    onSuccess: async (_response, registerCredentials) => {
      await onSuccess(registerCredentials);
    },
  });

  return (
    <div className="flex justify-center">
      <Paper>
        <form action={formAction} className="flex flex-col gap-7">
          <Typography className="text-center text-5xl" variant="h1">
            {variant}
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
          <SubmitButton>{variant}</SubmitButton>
        </form>
      </Paper>
    </div>
  );
}
