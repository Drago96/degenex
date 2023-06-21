import { NextRequest, NextResponse } from "next/server";
import EventSource from "eventsource";

import { getAppFetchHeaders } from "@/lib/app-fetch";
import { buildTradingPairPricesQuery } from "@/lib/trading-pairs/build-trading-pair-prices-query";
import { ServerRuntime } from "next";

export function GET(request: NextRequest, response: NextResponse) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const { searchParams } = new URL(request.url);

  const tradingPairPricesQuery = buildTradingPairPricesQuery(
    searchParams.getAll("tradingPairSymbols")
  );

  const eventSource = new EventSource(
    `${process.env.API_BASE_URL}/api/trading-pairs/track-prices?${tradingPairPricesQuery}`,
    {
      headers: getAppFetchHeaders(response.cookies, response.headers),
    }
  );

  eventSource.addEventListener("message", (event) => {
    writer.write(encoder.encode(`data: ${event.data}\n\n`));
  });

  return new Response(responseStream.readable, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "Content-Encoding": "none",
    },
  });
}

export const runtime: ServerRuntime = "nodejs";
