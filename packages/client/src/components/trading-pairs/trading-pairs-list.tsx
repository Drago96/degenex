"use client";

import { get } from "lodash";

import { TradingPairsPricesDto, TradingPairResponseDto } from "@degenex/common";
import { useEventSourceQuery } from "@/hooks/use-event-source-query";
import { buildTradingPairPricesQuery } from "@/lib/trading-pairs/build-trading-pair-prices-query";
import Typography from "../ui/typography";
import Card from "../ui/card";
import TradingPairPriceSkeleton from "./trading-pair-price-skeleton";

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

  const { data } = useEventSourceQuery<TradingPairsPricesDto>(
    ["trading-pair-prices"],
    `api/trading-pairs/track-prices?${tradingPairPricesQuery}`
  );

  return (
    <ul className="flex flex-wrap flex-row gap-5">
      {tradingPairSymbols.map((tradingPairSymbol) => {
        const tradingPairPrice = get(data, tradingPairSymbol);

        return (
          <li key={tradingPairSymbol}>
            <Card className="min-w-[150px]">
              <Typography variant="div">{tradingPairSymbol}</Typography>
              {tradingPairPrice === undefined && <TradingPairPriceSkeleton />}
              {tradingPairPrice !== undefined && (
                <Typography variant="div">
                  {tradingPairPrice.toFixed(2)}
                </Typography>
              )}
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
