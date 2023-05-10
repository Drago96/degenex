import { Asset, Currency, TradingPair } from '@prisma/client';

export type TradingPairWithAssociations = TradingPair & {
  asset: Asset;
  currency: Currency;
};

export const buildTradingPairSymbol = (
  tradingPair: TradingPairWithAssociations,
) => `${tradingPair.asset.tickerSymbol}/${tradingPair.currency.code}`;
