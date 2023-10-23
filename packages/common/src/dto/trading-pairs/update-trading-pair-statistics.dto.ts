import { z } from 'nestjs-zod/z';

import { CurrentCandlestickSchema } from '../candlesticks';
import { decimal } from '../../utils';

export const UpdateTradingPairStatisticsSchema =
  CurrentCandlestickSchema.extend({
    id: z.number(),
    priceChange: decimal(),
  });

export type UpdateTradingPairStatisticsDto = z.infer<
  typeof UpdateTradingPairStatisticsSchema
>;
