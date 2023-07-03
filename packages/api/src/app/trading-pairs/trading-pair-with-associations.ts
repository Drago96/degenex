import { Asset, Currency, TradingPair } from '@prisma/client';

export type TradingPairWithAssociations = TradingPair & {
  asset: Asset;
  currency: Currency;
};
