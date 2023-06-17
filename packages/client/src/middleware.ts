import { NextRequest, NextResponse } from "next/server";

const FORWARDED_FOR_HEADER_KEY = "x-forwarded-for";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.headers.get(FORWARDED_FOR_HEADER_KEY) && request.ip) {
    response.headers.set(FORWARDED_FOR_HEADER_KEY, request.ip);
  }

  return response;
}
