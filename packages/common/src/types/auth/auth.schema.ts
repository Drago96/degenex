import { z } from 'nestjs-zod/z';

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z
    .password()
    .min(10)
    .atLeastOne('digit')
    .atLeastOne('lowercase')
    .atLeastOne('uppercase')
    .atLeastOne('special'),
});
