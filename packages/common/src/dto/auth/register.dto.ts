import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

import { AuthSchema } from './auth.dto';

export const VERIFICATION_CODE_LENGTH = 6;

export const RegisterSchema = AuthSchema.extend({
  verificationCode: z
    .string()
    .length(VERIFICATION_CODE_LENGTH)
    .regex(/^[0-9]+$/),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
