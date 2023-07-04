import { flattenDeep } from "lodash";

export const buildTradingPairPricesQuery = (
  tradingPairSymbols?: string[] | string
) => {
  if (!tradingPairSymbols) {
    return undefined;
  }

  const tradingPairPricesSearchParams = new URLSearchParams();

  flattenDeep([tradingPairSymbols]).forEach((tradingPairSymbol) =>
    tradingPairPricesSearchParams.append(
      "tradingPairSymbols",
      tradingPairSymbol
    )
  );

  return tradingPairPricesSearchParams.toString();
};
