import { z } from "nestjs-zod/z";

import { LoginSchema } from "common/auth/login.schema";

export const RegisterSchema = LoginSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
