import EventSource from "eventsource";
import { NextApiRequest, NextApiResponse } from "next";

import { buildTradingPairPricesQuery } from "@/lib/trading-pairs/build-trading-pair-prices-query";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache, no-transform",
    "Content-Encoding": "none",
  });

  const tradingPairPricesQuery = buildTradingPairPricesQuery(
    req.query.tradingPairSymbols
  );

  const eventSource = new EventSource(
    `${process.env.API_BASE_URL}/api/trading-pairs/track-prices?${tradingPairPricesQuery}`
  );

  eventSource.addEventListener("message", (event) => {
    res.write("data: " + event.data + "\n\n");
  });

  res.socket?.on("close", () => {
    eventSource.close();
    res.end();
  });
}
