"use client";

import {
  TradingPairsStatisticsDto,
  TradingPairResponseDto,
  TradingPairsStatisticsSchema,
} from "@degenex/common";
import { useEventSourceQuery } from "@/hooks/use-event-source-query";
import { buildTradingPairPricesQuery } from "@/lib/trading-pairs/build-trading-pair-prices-query";
import TradingPairsList from "./trading-pairs-list";

type TradingPairsListProps = {
  tradingPairs: TradingPairResponseDto[];
};

export default function TradingPairsContainer({
  tradingPairs,
}: TradingPairsListProps) {
  const tradingPairPricesQuery = buildTradingPairPricesQuery(
    tradingPairs.map((tradingPair) => tradingPair.id),
  );

  const { data } = useEventSourceQuery<TradingPairsStatisticsDto>(
    ["trading-pair-statistics"],
    `api/trading-pairs/track-statistics?${tradingPairPricesQuery}`,
    TradingPairsStatisticsSchema,
  );

  return (
    <TradingPairsList
      tradingPairs={tradingPairs}
      tradingPairsStatistics={data}
    />
  );
}
