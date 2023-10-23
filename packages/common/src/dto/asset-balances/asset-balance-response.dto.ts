import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

import { decimal } from '../../utils';

export const AssetBalanceResponseSchema = z.object({
  available: decimal(),
  locked: decimal(),
  asset: z.object({
    id: z.number(),
    logoUrl: z.string(),
    tickerSymbol: z.string(),
    fullName: z.string(),
  }),
});

export class AssetBalanceResponseDto extends createZodDto(
  AssetBalanceResponseSchema,
) {}
