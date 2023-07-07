import { TradingPairResponseDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import TradingPairsContainer from "@/components/trading-pairs/trading-pairs-container";
import TradingPairsList from "@/components/trading-pairs/trading-pairs-list";

export default async function TradingPairs() {
  const { data: tradingPairs } = await appFetch<TradingPairResponseDto[]>(
    "trading-pairs"
  );

  if (!tradingPairs) {
    return <TradingPairsList loading />;
  }

  return <TradingPairsContainer tradingPairs={tradingPairs} />;
}
