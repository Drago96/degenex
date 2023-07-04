import { Asset, TradingPair } from '@prisma/client';

export type TradingPairWithAssociations = TradingPair & {
  baseAsset: Asset;
  quoteAsset: Asset;
};
