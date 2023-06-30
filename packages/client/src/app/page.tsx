import { TradingPairResponseDto } from "@degenex/common";
import Typography from "@/components/common/typography";
import TradingPairsList from "@/components/trading-pairs/trading-pairs-list";
import { appFetch } from "@/lib/app-fetch";

export default async function Home() {
  const { data: tradingPairs } = await appFetch<TradingPairResponseDto[]>(
    "trading-pairs"
  );

  return (
    <div className="flex flex-col gap-5 lg:gap-20">
      <div className="flex flex-col gap-5">
        <Typography variant="h2" className="text-5xl font-bold">
          Buy & sell Assets in minutes
        </Typography>
        <Typography>Join the world&apos;s largest asset exchange</Typography>
      </div>
      {tradingPairs && <TradingPairsList tradingPairs={tradingPairs} />}
    </div>
  );
}
