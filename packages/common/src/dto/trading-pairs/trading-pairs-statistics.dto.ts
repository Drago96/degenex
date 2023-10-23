import { z } from 'nestjs-zod/z';

import { UpdateTradingPairStatisticsSchema } from './update-trading-pair-statistics.dto';

export const TradingPairsStatisticsSchema = z.record(
  z.coerce.number(),
  UpdateTradingPairStatisticsSchema,
);

export type TradingPairsStatisticsDto = z.infer<
  typeof TradingPairsStatisticsSchema
>;
