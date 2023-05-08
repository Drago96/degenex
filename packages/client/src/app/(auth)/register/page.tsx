"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import Paper from "@/app/components/paper";
import Typography from "@/app/components/typography";
import { RegisterDto, RegisterSchema } from "./schema";
import { registerUser } from "./actions";

export default function Register() {
  const {
    register,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  async function registerAction(formData: FormData) {
    const isFormValid = await trigger();

    const registerDto = Object.fromEntries(formData.entries()) as RegisterDto;

    if (!isFormValid) {
      return;
    }

    await registerUser(registerDto);
  }

  return (
    <div className="flex justify-center">
      <Paper>
        <form action={registerAction} className="flex flex-col gap-7">
          <Typography className="text-center text-5xl" variant="h1">
            Register
          </Typography>
          <Input type="email" label="Email" {...register("email")} />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => <p>{message}</p>}
          />
          <Input type="password" label="Password" {...register("password")} />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => <p>{message}</p>}
          />
          <Input
            type="password"
            label="Confirm Password"
            {...register("confirmPassword")}
          />
          <ErrorMessage
            errors={errors}
            name="confirmPassword"
            render={({ message }) => <p>{message}</p>}
          />
          <Button type="submit">Register</Button>
        </form>
      </Paper>
    </div>
  );
}
