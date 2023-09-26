import Typography from "@/components/ui/typography";
import { appFetch } from "@/lib/app-fetch";
import { TradingPairResponseDto } from "@degenex/common";

export default async function TradingPair({
  params: { id },
}: {
  params: { id: number };
}) {
  const tradingPairResponse = await appFetch<TradingPairResponseDto>(
    `trading-pairs/${id}`,
  );

  if (!tradingPairResponse.isSuccess) {
    return null;
  }

  return (
    <Typography variant="h1">
      {JSON.stringify(tradingPairResponse.data)}
    </Typography>
  );
}
