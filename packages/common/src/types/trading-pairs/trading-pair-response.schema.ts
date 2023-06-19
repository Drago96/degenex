import { z } from 'nestjs-zod/z';

import { AssetType } from '@prisma/client';

export const TradingPairResponseSchema = z.object({
  asset: z.object({
    id: z.number(),
    tickerSymbol: z.string(),
    type: z.nativeEnum(AssetType),
  }),
  currency: z.object({
    id: z.number(),
    code: z.string(),
  }),
});
