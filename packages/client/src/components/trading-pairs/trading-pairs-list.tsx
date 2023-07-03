"use client";

import { get } from "lodash";
import Image from "next/image";

import {
  TradingPairsPricesDto,
  TradingPairResponseDto,
  buildTradingPairSymbol,
} from "@degenex/common";
import { useEventSourceQuery } from "@/hooks/use-event-source-query";
import { buildTradingPairPricesQuery } from "@/lib/trading-pairs/build-trading-pair-prices-query";
import Typography from "../ui/typography";
import Card from "../ui/card";
import TradingPairPriceSkeleton from "./trading-pair-price-skeleton";
import { MdIndeterminateCheckBox } from "react-icons/md";

type TradingPairsListProps = {
  tradingPairs: TradingPairResponseDto[];
};

export default function TradingPairsList({
  tradingPairs,
}: TradingPairsListProps) {
  const tradingPairSymbols = tradingPairs.map((tradingPair) =>
    buildTradingPairSymbol(tradingPair)
  );

  const tradingPairPricesQuery =
    buildTradingPairPricesQuery(tradingPairSymbols);

  const { data } = useEventSourceQuery<TradingPairsPricesDto>(
    ["trading-pair-prices"],
    `api/trading-pairs/track-prices?${tradingPairPricesQuery}`
  );

  return (
    <ul className="flex flex-row flex-wrap gap-5">
      {tradingPairs.map((tradingPair) => {
        const tradingPairSymbol = buildTradingPairSymbol(tradingPair);

        const tradingPairPrice = get(data, tradingPairSymbol);

        return (
          <li key={tradingPairSymbol}>
            <Card className="flex min-w-[150px] flex-row gap-3">
              {tradingPair.asset.logoUrl ? (
                <Image
                  src={tradingPair.asset.logoUrl}
                  alt={tradingPair.asset.tickerSymbol}
                  width={40}
                  height={40}
                />
              ) : (
                <MdIndeterminateCheckBox size={40} />
              )}
              <div>
                <Typography variant="div">{tradingPairSymbol}</Typography>
                {tradingPairPrice === undefined ? (
                  <TradingPairPriceSkeleton />
                ) : (
                  <Typography variant="div">
                    {tradingPairPrice.toFixed(2)}
                  </Typography>
                )}
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
