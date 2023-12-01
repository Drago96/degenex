import { notFound } from "next/navigation";

import Typography from "@/components/ui/typography";
import { appFetch } from "@/lib/app-fetch";
import {
  TradingPairResponseDto,
  TradingPairResponseSchema,
} from "@degenex/common";

export default async function TradingPair({
  params: { id },
}: {
  params: { id: number };
}) {
  const tradingPairResponse = await appFetch<TradingPairResponseDto>(
    `trading-pairs/${id}`,
    {
      responseSchema: TradingPairResponseSchema,
    },
  );

  if (tradingPairResponse.statusCode === 404) {
    notFound();
  }

  return (
    <Typography variant="h1">
      {JSON.stringify(tradingPairResponse.data)}
    </Typography>
  );
}
