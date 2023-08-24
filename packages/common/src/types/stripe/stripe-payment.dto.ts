import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

import { decimal } from '../../utils';

export const ALLOWED_CURRENCIES = ['USD'] as const;

export const StripePaymentSchema = z.object({
  currency: z.enum(ALLOWED_CURRENCIES),
  amount: decimal((z) => z.gte(10).lte(100000)),
});

export class StripePaymentDto extends createZodDto(StripePaymentSchema) {}
