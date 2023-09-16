import { z } from 'nestjs-zod/z';

import { TradingPairStatisticsUpdateSchema } from './trading-pair-statistics-update.dto';

export const TradingPairsStatisticsSchema = z.record(
  z.coerce.number(),
  TradingPairStatisticsUpdateSchema,
);

export type TradingPairsStatisticsDto = z.infer<
  typeof TradingPairsStatisticsSchema
>;
