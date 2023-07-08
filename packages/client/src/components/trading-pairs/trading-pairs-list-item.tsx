import Image from "next/image";

import {
  buildTradingPairSymbol,
  TradingPairResponseDto,
} from "@degenex/common";
import { PendingFetch } from "@/types/pending-fetch";
import Card from "../ui/card";
import Typography from "../ui/typography";
import Skeleton from "../ui/skeleton";

type TradingPairListItemProps = PendingFetch<
  TradingPairResponseDto & { tradingPairPrice?: number }
>;

export default function TradingPairListItem(props: TradingPairListItemProps) {
  return (
    <li>
      <Card className="flex min-w-[160px] flex-row gap-3 align-middle">
        {props.loading ? (
          <Skeleton variant="circle" className="h-[40px] w-[40px]" />
        ) : (
          <div className="relative h-[40px] w-[40px]">
            <Image
              src={props.baseAsset.logoUrl}
              alt={props.baseAsset.tickerSymbol}
              fill
            />
          </div>
        )}
        <div className="flex grow flex-col justify-center gap-2">
          {props.loading ? (
            <Skeleton />
          ) : (
            <Typography variant="div" className="leading-4">
              {buildTradingPairSymbol(props)}
            </Typography>
          )}
          {props.loading || props.tradingPairPrice === undefined ? (
            <Skeleton />
          ) : (
            <Typography variant="div" className="leading-4">
              {props.quoteAsset.currencySymbol}
              {props.tradingPairPrice.toFixed(2)}
            </Typography>
          )}
        </div>
      </Card>
    </li>
  );
}
