import { z } from 'nestjs-zod/z';

import { AssetType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod/dto';

export const TradingPairResponseSchema = z.object({
  baseAsset: z.object({
    id: z.number(),
    tickerSymbol: z.string(),
    type: z.nativeEnum(AssetType),
    logoUrl: z.string(),
  }),
  quoteAsset: z.object({
    id: z.number(),
    tickerSymbol: z.string(),
    currencySymbol: z.string(),
  }),
});

export class TradingPairResponseDto extends createZodDto(
  TradingPairResponseSchema
) {}
