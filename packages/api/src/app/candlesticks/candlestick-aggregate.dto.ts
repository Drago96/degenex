import { Candlestick } from '@prisma/client';

export type CandlestickAggregateDto = Pick<
  Candlestick,
  | 'lowestPrice'
  | 'highestPrice'
  | 'baseAssetVolume'
  | 'quoteAssetVolume'
  | 'tradesCount'
  | 'lastTradeId'
>;
