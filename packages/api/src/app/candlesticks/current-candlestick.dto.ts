import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { decimal } from '@degenex/common';

export const CurrentCandlestickSchema = z.object({
  openPrice: decimal(),
  openTime: z.date(),
  lowestPrice: decimal(),
  highestPrice: decimal(),
  baseAssetVolume: decimal(),
  quoteAssetVolume: decimal(),
  tradesCount: z.number(),
  lastTradeId: z.number(),
});

export class CurrentCandlestickDto extends createZodDto(
  CurrentCandlestickSchema,
) {}
