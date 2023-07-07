import { ReactNode } from "react";

type WalletLayoutProps = {
  children: ReactNode;
  assetBalances: ReactNode;
  modal: ReactNode;
};

export default function WalletLayout({
  children,
  modal,
  assetBalances,
}: WalletLayoutProps) {
  return (
    <div className="flex flex-col gap-10 lg:gap-20">
      {children}
      {assetBalances}
      {modal}
    </div>
  );
}
