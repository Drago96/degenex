import { NextRequest, NextResponse } from "next/server";

const FORWARDED_FOR_HEADER_KEY = "x-forwarded-for";

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);

  if (!headers.get(FORWARDED_FOR_HEADER_KEY) && request.ip) {
    headers.set(FORWARDED_FOR_HEADER_KEY, request.ip);
  }

  return NextResponse.next({ headers });
}
