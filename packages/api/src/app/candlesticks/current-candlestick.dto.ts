import { Candlestick } from '@prisma/client';

export type CurrentCandlestickDto = Pick<
  Candlestick,
  | 'openPrice'
  | 'openTime'
  | 'lowestPrice'
  | 'highestPrice'
  | 'baseAssetVolume'
  | 'quoteAssetVolume'
  | 'tradesCount'
  | 'lastTradeId'
>;
