import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod/dto';

import { decimal } from '@degenex/common';

export const CandlestickAggregateSchema = z.object({
  lowestPrice: decimal(),
  highestPrice: decimal(),
  baseAssetVolume: decimal(),
  quoteAssetVolume: decimal(),
  tradesCount: z.number(),
  lastTradeId: z.number(),
  lastTradePrice: decimal(),
});

export class CandlestickAggregateDto extends createZodDto(
  CandlestickAggregateSchema,
) {}
