import { ReactNode } from "react";

type WalletLayoutProps = {
  children: ReactNode;
  assetBalance: ReactNode;
  modal: ReactNode;
};

export default function WalletLayout({
  children,
  modal,
  assetBalance,
}: WalletLayoutProps) {
  return (
    <div className="flex flex-col gap-10 lg:gap-20">
      {children}
      {assetBalance}
      {modal}
    </div>
  );
}
