import { AssetBalanceResponseDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import { AssetType } from "@prisma/client";
import AssetBalancesTab from "./asset-balances-tab";
import ServerErrorNotification from "../server-error-notification";

type AssetBalancesTabContainerProps = {
  assetType: AssetType;
};

export default async function AssetBalancesTabContainer({
  assetType,
}: AssetBalancesTabContainerProps) {
  const assetBalancesResponse = await appFetch<AssetBalanceResponseDto[]>(
    `asset-balances?assetType=${assetType}`
  );

  if (!assetBalancesResponse.isSuccess) {
    return (
      <ServerErrorNotification error={assetBalancesResponse.error}>
        <AssetBalancesTab loading />
      </ServerErrorNotification>
    );
  }

  return <AssetBalancesTab assetBalances={assetBalancesResponse.data} />;
}
