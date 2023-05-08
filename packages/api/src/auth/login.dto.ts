import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .password()
    .min(10)
    .atLeastOne('digit')
    .atLeastOne('lowercase')
    .atLeastOne('uppercase')
    .atLeastOne('special'),
});

export class LoginDto extends createZodDto(LoginSchema) {}
