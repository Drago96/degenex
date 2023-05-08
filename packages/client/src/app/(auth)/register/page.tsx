"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import Paper from "@/app/components/paper";
import Typography from "@/app/components/typography";
import { RegisterDto, RegisterSchema } from "./register-schema";
import { registerUser } from "./actions";

export default function Register() {
  const {
    register,
    trigger,
    formState: { errors },
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

    await registerUser(registerDto);
  }

  return (
    <div className="flex justify-center">
      <Paper>
        <form action={registerAction} className="flex flex-col gap-7">
          <Typography className="text-center text-5xl" variant="h1">
            Register
          </Typography>
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
          <Button type="submit">Register</Button>
        </form>
      </Paper>
    </div>
  );
}
