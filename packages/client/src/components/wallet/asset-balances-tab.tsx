import { appFetch } from "@/lib/app-fetch";
import { AssetType } from "@prisma/client";

type AssetBalancesTabProps = {
  assetType: AssetType;
};

export default async function AssetBalancesTab({
  assetType,
}: AssetBalancesTabProps) {
  const assetBalances = await appFetch(`asset-balances?assetType=${assetType}`);

  return JSON.stringify(assetBalances);
}
