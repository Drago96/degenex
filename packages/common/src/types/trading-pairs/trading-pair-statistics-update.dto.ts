import { z } from 'nestjs-zod/z';

import { CurrentCandlestickSchema } from '../candlesticks';
import { decimal } from '../../utils';

export const TradingPairStatisticsUpdateSchema =
  CurrentCandlestickSchema.extend({
    id: z.number(),
    priceChange: decimal(),
  });

export type TradingPairStatisticsUpdateDto = z.infer<
  typeof TradingPairStatisticsUpdateSchema
>;
