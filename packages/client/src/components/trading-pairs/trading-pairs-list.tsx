"use client";

import { useMemo } from "react";

import { TradingPairResponseDto } from "@degenex/common";
import { useEventSourceQuery } from "@/hooks/use-event-source-query";
import { buildTradingPairPricesQuery } from "@/lib/trading-pairs/build-trading-pair-prices-query";

type TradingPairsListProps = {
  tradingPairs: TradingPairResponseDto[];
};

export default function TradingPairsList({
  tradingPairs,
}: TradingPairsListProps) {
  const tradingPairPricesQuery = useMemo(() => {
    const tradingPairSymbols = tradingPairs.map(
      (tradingPair) =>
        `${tradingPair.asset.tickerSymbol}/${tradingPair.currency.code}`
    );

    return buildTradingPairPricesQuery(tradingPairSymbols);
  }, [tradingPairs]);

  const { data } = useEventSourceQuery(
    ["trading-pair-prices"],
    `api/trading-pairs/track-prices?${tradingPairPricesQuery}`
  );

  return JSON.stringify(data);
}
