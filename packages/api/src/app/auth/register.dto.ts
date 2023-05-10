import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { LoginSchema } from '@degenex/common';

export const RegisterSchema = LoginSchema.extend({
  verificationCode: z.string().length(6).regex(/\d{6}/),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
