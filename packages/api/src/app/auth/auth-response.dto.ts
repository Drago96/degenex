import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
});

export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}
