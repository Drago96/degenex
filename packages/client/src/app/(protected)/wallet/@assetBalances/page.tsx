import { Suspense } from "react";

import { AssetType } from "@prisma/client";
import AssetBalancesTabLink from "@/components/wallet/asset-balances-tab-link";
import AssetBalancesTabContainer from "@/components/wallet/asset-balances-tab-container";
import AssetBalancesTab from "@/components/wallet/asset-balances-tab";

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
      <div className="flex flex-col gap-5">
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
        <Suspense fallback={<AssetBalancesTab loading />}>
          <AssetBalancesTabContainer
            assetType={assetType || AssetType.FiatMoney}
          />
        </Suspense>
      </div>
    </>
  );
}
