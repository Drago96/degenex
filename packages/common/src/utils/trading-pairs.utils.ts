export const buildTradingPairSymbol = (tradingPair: {
  asset: { tickerSymbol: string };
  currency: { code: string };
}) => `${tradingPair.asset.tickerSymbol}/${tradingPair.currency.code}`;
