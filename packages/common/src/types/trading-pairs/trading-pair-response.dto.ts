import { z } from 'nestjs-zod/z';

import { AssetType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod/dto';

export const TradingPairResponseSchema = z.object({
  asset: z.object({
    id: z.number(),
    tickerSymbol: z.string(),
    type: z.nativeEnum(AssetType),
    logoUrl: z.string().nullable(),
  }),
  currency: z.object({
    id: z.number(),
    code: z.string(),
    symbol: z.string(),
  }),
});

export class TradingPairResponseDto extends createZodDto(
  TradingPairResponseSchema
) {}
