export const buildTradingPairSymbol = (tradingPair: {
  baseAsset: { tickerSymbol: string };
  quoteAsset: { tickerSymbol: string };
}) =>
  `${tradingPair.baseAsset.tickerSymbol}/${tradingPair.quoteAsset.tickerSymbol}`;
