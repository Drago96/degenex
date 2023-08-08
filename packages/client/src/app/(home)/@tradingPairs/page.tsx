import { TradingPairResponseDto } from "@degenex/common";
import { appFetch } from "@/lib/app-fetch";
import TradingPairsContainer from "@/components/trading-pairs/trading-pairs-container";
import TradingPairsList from "@/components/trading-pairs/trading-pairs-list";
import ServerErrorToast from "@/components/server-error-toast";

export default async function TradingPairs() {
  const tradingPairsResponse = await appFetch<TradingPairResponseDto[]>(
    "trading-pairs",
    {
      next: {
        revalidate: 300,
      },
    },
  );

  if (!tradingPairsResponse.isSuccess) {
    return (
      <ServerErrorToast error={tradingPairsResponse.error}>
        <TradingPairsList loading />
      </ServerErrorToast>
    );
  }

  return <TradingPairsContainer tradingPairs={tradingPairsResponse.data} />;
}
