import { flattenDeep } from "lodash";

export const buildTradingPairPricesQuery = (tradingPairIds?: number[]) => {
  if (!tradingPairIds) {
    return undefined;
  }

  const tradingPairPricesSearchParams = new URLSearchParams();

  flattenDeep([tradingPairIds]).forEach((tradingPairId) =>
    tradingPairPricesSearchParams.append(
      "tradingPairIds",
      tradingPairId.toString(),
    ),
  );

  return tradingPairPricesSearchParams.toString();
};
