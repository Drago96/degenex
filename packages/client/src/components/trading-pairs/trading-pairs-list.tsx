import { get } from "lodash";

import {
  TradingPairResponseDto,
  TradingPairsStatisticsDto,
} from "@degenex/common";
import { PendingFetch } from "@/types/pending-fetch";
import TradingPairListItem from "./trading-pairs-list-item";

type TradingPairsListProps = PendingFetch<{
  tradingPairs: TradingPairResponseDto[];
  tradingPairsStatistics?: TradingPairsStatisticsDto | null;
}>;

export default function TradingPairsList(props: TradingPairsListProps) {
  return (
    <ul className="flex flex-row flex-wrap gap-5">
      {props.loading
        ? Array.from({ length: 3 }).map((_, index) => (
            <TradingPairListItem key={index} loading />
          ))
        : props.tradingPairs.map((tradingPair) => {
            const tradingPairStatistics = get(
              props.tradingPairsStatistics,
              tradingPair.id,
            );

            return (
              <TradingPairListItem
                key={tradingPair.id}
                tradingPairPrice={tradingPairStatistics?.lastTradePrice}
                {...tradingPair}
              />
            );
          })}
    </ul>
  );
}
