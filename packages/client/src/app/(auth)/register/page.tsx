"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/input";
import Paper from "@/components/paper";
import Typography from "@/components/typography";
import { RegisterSchema } from "./register-schema";
import { registerUser } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import ErrorMessage from "@/components/error-message";
import { createFormServerAction } from "@/lib/create-form-server-action";

export default function Register() {
  const {
    register,
    trigger,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    mode: "onTouched",
  });

  return (
    <div className="flex justify-center">
      <Paper>
        <form
          action={createFormServerAction({
            action: registerUser,
            validateForm: trigger,
            setError,
          })}
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
            {...register("email")}
          />
          <Input
            type="password"
            label="Password"
            errors={errors}
            {...register("password")}
          />
          <Input
            type="password"
            label="Confirm Password"
            errors={errors}
            {...register("confirmPassword")}
          />
          <SubmitButton>Register</SubmitButton>
        </form>
      </Paper>
    </div>
  );
}
