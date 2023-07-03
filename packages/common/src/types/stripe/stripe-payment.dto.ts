import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

export const ALLOWED_CURRENCIES = ['USD', 'EUR'] as const;

export const StripePaymentSchema = z.object({
  currency: z.enum(ALLOWED_CURRENCIES),
  amount: z.number().gte(10).lte(100000),
});

export class StripePaymentDto extends createZodDto(StripePaymentSchema) {}
