import { z } from 'nestjs-zod/z';

import { AuthSchema } from './auth.schema';

export const VERIFICATION_CODE_LENGTH = 6;

export const RegisterSchema = AuthSchema.extend({
  verificationCode: z
    .string()
    .length(VERIFICATION_CODE_LENGTH)
    .regex(new RegExp(`\\d${VERIFICATION_CODE_LENGTH}`)),
});
