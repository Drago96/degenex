import { Suspense } from "react";

import { AssetType } from "@prisma/client";
import AssetBalancesTabLink from "@/components/wallet/asset-balances-tab-link";
import AssetBalancesTab from "@/components/wallet/asset-balances-tab";
import Typography from "@/components/ui/typography";

type AssetBalancesProps = {
  searchParams: {
    assetType?: AssetType;
  };
};

export default function AssetBalances({
  searchParams: { assetType },
}: AssetBalancesProps) {
  return (
    <>
      <ul className="flex flex-wrap border-b border-primary text-center dark:border-primary-dark">
        <AssetBalancesTabLink
          active={
            assetType !== AssetType.Stock && assetType !== AssetType.Crypto
          }
          assetType={AssetType.FiatMoney}
        >
          Fiat Money
        </AssetBalancesTabLink>
        <AssetBalancesTabLink
          active={assetType === AssetType.Stock}
          assetType={AssetType.Stock}
        >
          Stocks
        </AssetBalancesTabLink>
        <AssetBalancesTabLink
          active={assetType === AssetType.Crypto}
          assetType={AssetType.Crypto}
        >
          Crypto
        </AssetBalancesTabLink>
      </ul>
      <div>
        <Suspense fallback={<Typography>Loading...</Typography>}>
          <AssetBalancesTab assetType={assetType || AssetType.FiatMoney} />
        </Suspense>
      </div>
    </>
  );
}
