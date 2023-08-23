import { AssetBalanceResponseDto } from "@degenex/common";
import { PendingFetch } from "@/types/pending-fetch";
import AssetBalanceTabItem from "./asset-balances-tab-item";

type AssetBalancesTabProps = PendingFetch<{
  assetBalances: AssetBalanceResponseDto[];
}>;

export default function AssetBalancesTab(props: AssetBalancesTabProps) {
  return (
    <table className="table-fixed">
      <tbody>
        {props.loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <AssetBalanceTabItem key={index} loading />
            ))
          : props.assetBalances.map((assetBalance) => {
              return (
                <AssetBalanceTabItem
                  key={assetBalance.asset.id}
                  {...assetBalance}
                />
              );
            })}
      </tbody>
    </table>
  );
}
