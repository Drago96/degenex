import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod/dto';

import { decimal } from '../../utils';

export const CurrentCandlestickSchema = z.object({
  openPrice: decimal(),
  openTime: z.coerce.date(),
  lowestPrice: decimal(),
  highestPrice: decimal(),
  baseAssetVolume: decimal(),
  quoteAssetVolume: decimal(),
  tradesCount: z.number(),
  lastTradeId: z.number(),
  lastTradePrice: decimal(),
});

export class CurrentCandlestickDto extends createZodDto(
  CurrentCandlestickSchema,
) {}
