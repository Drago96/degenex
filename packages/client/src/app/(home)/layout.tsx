import { ReactNode } from "react";

type HomeLayoutProps = {
  children: ReactNode;
  tradingPairs: ReactNode;
};

export default function HomeLayout({
  children,
  tradingPairs,
}: HomeLayoutProps) {
  return (
    <div className="flex flex-col gap-5 lg:gap-20">
      {children}
      {tradingPairs}
    </div>
  );
}
