import { TradingPairResponseDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import TradingPairsContainer from "@/components/trading-pairs/trading-pairs-container";
import TradingPairsList from "@/components/trading-pairs/trading-pairs-list";
import ServerErrorNotification from "@/components/server-error-notification";

export default async function TradingPairs() {
  const tradingPairsResponse = await appFetch<TradingPairResponseDto[]>(
    "trading-pairs"
  );

  if (!tradingPairsResponse.isSuccess) {
    return (
      <ServerErrorNotification error={tradingPairsResponse.error}>
        <TradingPairsList loading />
      </ServerErrorNotification>
    );
  }

  return <TradingPairsContainer tradingPairs={tradingPairsResponse.data} />;
}
