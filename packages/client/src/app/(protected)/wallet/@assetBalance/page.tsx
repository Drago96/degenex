import AssetBalanceTabLink from "@/components/wallet/asset-balance-tab-link";
import { AssetType } from "@prisma/client";

type AssetBalanceTabsProps = {
  searchParams: {
    assetType?: AssetType;
  };
};

export default function AssetBalanceTabs({
  searchParams: { assetType },
}: AssetBalanceTabsProps) {
  return (
    <>
      <ul className="flex flex-wrap border-b border-primary text-center dark:border-primary-dark">
        <AssetBalanceTabLink
          active={
            assetType !== AssetType.Stock && assetType !== AssetType.Crypto
          }
          assetType={AssetType.FiatMoney}
        >
          Fiat Money
        </AssetBalanceTabLink>
        <AssetBalanceTabLink
          active={assetType === AssetType.Stock}
          assetType={AssetType.Stock}
        >
          Stocks
        </AssetBalanceTabLink>
        <AssetBalanceTabLink
          active={assetType === AssetType.Crypto}
          assetType={AssetType.Crypto}
        >
          Crypto
        </AssetBalanceTabLink>
      </ul>
      <div>{assetType}</div>
    </>
  );
}
