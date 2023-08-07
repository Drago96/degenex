"use client";

import {
  TradingPairsPricesDto,
  TradingPairResponseDto,
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
  const tradingPairPricesQuery =
    buildTradingPairPricesQuery(tradingPairs.map(tradingPair => tradingPair.id));

  const { data } = useEventSourceQuery<TradingPairsPricesDto>(
    ["trading-pair-prices"],
    `api/trading-pairs/track-prices?${tradingPairPricesQuery}`
  );

  return (
    <TradingPairsList tradingPairs={tradingPairs} tradingPairsPrices={data} />
  );
}
