import { z } from 'nestjs-zod/z';

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
});
