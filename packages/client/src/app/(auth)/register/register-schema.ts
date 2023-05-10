import { z } from 'nestjs-zod/z';

import { LoginSchema } from '@degenex/common';

export const RegisterSchema = LoginSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
