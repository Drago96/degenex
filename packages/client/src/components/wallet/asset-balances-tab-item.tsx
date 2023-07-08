import Image from "next/image";

import { AssetBalanceResponseDto } from "@degenex/common";
import { PendingFetch } from "@/types/pending-fetch";
import Skeleton from "../ui/skeleton";
import Typography from "../ui/typography";

type AssetBalanceTabItemProps = PendingFetch<AssetBalanceResponseDto>;

export default function AssetBalanceTabItem(props: AssetBalanceTabItemProps) {
  return (
    <tr className="border-b border-primary hover:bg-primary dark:border-background-dark dark:bg-primary-dark dark:hover:bg-highlight-dark">
      <td className="px-6 py-4" width={100}>
        {props.loading ? (
          <Skeleton variant="circle" className="h-[40px] w-[40px]" />
        ) : (
          <div className="relative h-[40px] w-[40px]">
            <Image src={props.logoUrl} alt={props.tickerSymbol} fill />
          </div>
        )}
      </td>
      <td className="px-6 py-4" width={300}>
        {props.loading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="w-[40px]" />
            <Skeleton className="w-[100px]" />
          </div>
        ) : (
          <Typography variant="div" className="flex flex-col gap-2 leading-4">
            <div>{props.tickerSymbol}</div>
            <div>{props.fullName}</div>
          </Typography>
        )}
      </td>
      <td className="px-6 py-4">
        {props.loading ? (
          <Skeleton className="w-[150px]" />
        ) : (
          <Typography className="leading-4">
            {props.userBalance.toFixed(10)}
          </Typography>
        )}
      </td>
    </tr>
  );
}
