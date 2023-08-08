import { AssetBalanceResponseDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import { AssetType } from "@prisma/client";
import AssetBalancesTab from "./asset-balances-tab";
import ServerErrorToast from "../server-error-toast";

type AssetBalancesTabContainerProps = {
  assetType: AssetType;
};

export default async function AssetBalancesTabContainer({
  assetType,
}: AssetBalancesTabContainerProps) {
  const assetBalancesResponse = await appFetch<AssetBalanceResponseDto[]>(
    `asset-balances?assetType=${assetType}`,
  );

  if (!assetBalancesResponse.isSuccess) {
    return (
      <ServerErrorToast error={assetBalancesResponse.error}>
        <AssetBalancesTab loading />
      </ServerErrorToast>
    );
  }

  return <AssetBalancesTab assetBalances={assetBalancesResponse.data} />;
}
