import Image from "next/image";

import { PendingFetch } from "@/types/pending-fetch";
import { AssetBalanceResponseDto } from "@degenex/common";
import Typography from "../ui/typography";

type AssetBalancesTabProps = PendingFetch<{
  assetBalances: AssetBalanceResponseDto[];
}>;

export default function AssetBalancesTab(props: AssetBalancesTabProps) {
  if (props.loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <table className="table-fixed">
      <tbody>
        {props.assetBalances.map((assetBalance) => {
          return (
            <tr
              key={assetBalance.tickerSymbol}
              className="border-b border-primary hover:bg-primary dark:border-background-dark dark:bg-primary-dark dark:hover:bg-highlight-dark"
            >
              <td className="px-6 py-4">
                <div className="relative h-[40px] w-[40px]">
                  <Image
                    src={assetBalance.logoUrl}
                    alt={assetBalance.tickerSymbol}
                    fill
                  />
                </div>
              </td>
              <td className="px-6 py-4">
                <Typography variant="div">
                  <div>{assetBalance.tickerSymbol}</div>
                  <div>{assetBalance.fullName}</div>
                </Typography>
              </td>
              <td className="px-6 py-4">
                <Typography>{assetBalance.userBalance.toFixed(10)}</Typography>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
