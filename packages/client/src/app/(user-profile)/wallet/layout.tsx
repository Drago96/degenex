import { ReactNode } from "react";

type WalletLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function WalletLayout({ children, modal }: WalletLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
