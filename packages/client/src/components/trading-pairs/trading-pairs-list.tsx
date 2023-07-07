import { get } from "lodash";

import {
  buildTradingPairSymbol,
  TradingPairResponseDto,
  TradingPairsPricesDto,
} from "@degenex/common";
import { PendingFetch } from "@/types/pending-fetch";
import TradingPairListItem from "./trading-pairs-list-item";

type TradingPairsListProps = PendingFetch<{
  tradingPairs: TradingPairResponseDto[];
  tradingPairsPrices?: TradingPairsPricesDto | null;
}>;

export default function TradingPairsList(props: TradingPairsListProps) {
  return (
    <ul className="flex flex-row flex-wrap gap-5">
      {props.loading &&
        Array.from({ length: 3 }).map((_, index) => (
          <TradingPairListItem key={index} loading />
        ))}
      {!props.loading &&
        props.tradingPairs.map((tradingPair) => {
          const tradingPairSymbol = buildTradingPairSymbol(tradingPair);

          const tradingPairPrice = get(
            props.tradingPairsPrices,
            tradingPairSymbol
          );

          return (
            <TradingPairListItem
              key={tradingPairSymbol}
              tradingPairPrice={tradingPairPrice}
              {...tradingPair}
            />
          );
        })}
    </ul>
  );
}
