import Image from "next/image";
import Decimal from "decimal.js";

import {
  buildTradingPairSymbol,
  TradingPairResponseDto,
} from "@degenex/common";
import { PendingFetch } from "@/types/pending-fetch";
import Typography from "../ui/typography";
import Skeleton from "../ui/skeleton";
import PriceChangeBadge from "./price-change-badge";

type TradingPairListItemProps = PendingFetch<
  TradingPairResponseDto & { currentPrice?: Decimal; priceChange?: Decimal }
>;

export default function TradingPairListItem(props: TradingPairListItemProps) {
  return (
    <tr className="border-b border-primary hover:bg-primary dark:border-background-dark dark:bg-primary-dark dark:hover:bg-accent-dark">
      <td className="px-6 py-4" width={100}>
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
      </td>
      <td className="px-6 py-4" width={150}>
        {props.loading ? (
          <Skeleton />
        ) : (
          <Typography variant="div" className="leading-4">
            {buildTradingPairSymbol(props)}
          </Typography>
        )}
      </td>
      <td className="px-6 py-4" width={150}>
        {props.loading || props.currentPrice === undefined ? (
          <Skeleton className="w-[100px]" />
        ) : (
          <Typography variant="div" className="leading-4">
            {props.quoteAsset.currencySymbol}
            {props.currentPrice.toFixed(2)}
          </Typography>
        )}
      </td>
      <td className="px-6 py-2">
        {props.loading ||
        props.currentPrice === undefined ||
        props.priceChange === undefined ? (
          <Skeleton className="h-8 w-[100px]" />
        ) : (
          <PriceChangeBadge
            currentPrice={props.currentPrice}
            priceChange={props.priceChange}
          />
        )}
      </td>
    </tr>
  );
}
