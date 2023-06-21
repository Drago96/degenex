"use client";

import { get } from "lodash";

import { TradingPairResponseDto } from "@degenex/common";
import { useEventSourceQuery } from "@/hooks/use-event-source-query";
import { buildTradingPairPricesQuery } from "@/lib/trading-pairs/build-trading-pair-prices-query";
import Typography from "../common/typography";
import Card from "../common/card";

type TradingPairsListProps = {
  tradingPairs: TradingPairResponseDto[];
};

export default function TradingPairsList({
  tradingPairs,
}: TradingPairsListProps) {
  const tradingPairSymbols = tradingPairs.map(
    (tradingPair) =>
      `${tradingPair.asset.tickerSymbol}/${tradingPair.currency.code}`
  );

  const tradingPairPricesQuery =
    buildTradingPairPricesQuery(tradingPairSymbols);

  const { data } = useEventSourceQuery(
    ["trading-pair-prices"],
    `api/trading-pairs/track-prices?${tradingPairPricesQuery}`
  );

  return (
    <ul className="flex flex-row gap-5">
      {tradingPairSymbols.map((tradingPairSymbol) => (
        <li key={tradingPairSymbol}>
          <Card>
            <Typography variant="div">{tradingPairSymbol}</Typography>
            <Typography variant="div">
              {get(data, tradingPairSymbol)}
            </Typography>
          </Card>
        </li>
      ))}
    </ul>
  );
}
