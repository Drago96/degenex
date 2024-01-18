import {
  AssetBalanceResponseDto,
  AssetBalanceResponseSchema,
} from "@degenex/common";
import { AssetType } from "@prisma/client";
import { z } from "nestjs-zod/z";

import AssetBalancesTab from "./asset-balances-tab";
import ServerErrorToast from "../server-error-toast";
import { getCurrentUser } from "@/services/users.service";
import { appFetch } from "@/lib/app-fetch";

type AssetBalancesTabContainerProps = {
  assetType: AssetType;
};

export default async function AssetBalancesTabContainer({
  assetType,
}: AssetBalancesTabContainerProps) {
  const currentUser = getCurrentUser();

  const assetBalancesResponse = await appFetch<AssetBalanceResponseDto[]>(
    `users/${currentUser?.id}/asset-balances?assetType=${assetType}`,
    {
      responseSchema: z.array(AssetBalanceResponseSchema),
    },
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
