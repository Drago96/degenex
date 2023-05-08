import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const SendVerificationCodeSchema = z.object({
  email: z.string().email(),
});

export class SendVerificationCodeDto extends createZodDto(
  SendVerificationCodeSchema,
) {}
