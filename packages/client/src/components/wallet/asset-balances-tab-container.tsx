import { AssetBalanceResponseDto, AssetBalanceResponseSchema } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import { AssetType } from "@prisma/client";
import { z } from "nestjs-zod/z";

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
    {
      responseSchema: z.array(AssetBalanceResponseSchema)
    }
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
