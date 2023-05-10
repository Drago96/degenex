"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/input";
import Paper from "@/components/paper";
import Typography from "@/components/typography";
import { RegisterDto, RegisterSchema } from "./register-schema";
import { registerUser } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import ErrorMessage from "@/components/error-message";

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

  async function registerAction(formData: FormData) {
    const isFormValid = await trigger();

    if (!isFormValid) {
      return;
    }

    const registerDto = Object.fromEntries(formData.entries()) as RegisterDto;

    try {
      await registerUser(registerDto);
    } catch (error) {
      if (error instanceof Error) {
        setError("root", { message: error.message });
      }
    }
  }

  return (
    <div className="flex justify-center">
      <Paper>
        <form action={registerAction} className="flex flex-col gap-7">
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
