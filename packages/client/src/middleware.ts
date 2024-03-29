import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import { JwtPayload, jwtDecode } from "jwt-decode";
import moment from "moment";

import { AuthResponseDto } from "@degenex/common";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  clearAuth,
  REFRESH_TOKEN_COOKIE_KEY,
  setAccessToken,
} from "./services/auth.service";
import { appFetch, getAppFetchHeaders } from "./lib/app-fetch";
import { cloneCookies } from "./lib/cookies";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};

export const middleware: NextMiddleware = async (request: NextRequest) => {
  const response = NextResponse.next();

  await refreshAuth(request, response);

  if (request.nextUrl.pathname.startsWith("/api")) {
    const rewriteResponse = NextResponse.rewrite(
      `${process.env.API_BASE_URL}/${request.nextUrl.pathname}${request.nextUrl.search}`,
      {
        headers: getAppFetchHeaders(request.cookies, response.headers),
      },
    );

    cloneCookies(response, rewriteResponse);

    return rewriteResponse;
  }

  return response;
};

async function refreshAuth(request: NextRequest, response: NextResponse) {
  const accessTokenJwt = request.cookies.get(ACCESS_TOKEN_COOKIE_KEY);

  if (!accessTokenJwt || !accessTokenJwt.value) {
    return;
  }

  const accessToken = await jwtDecode<JwtPayload>(accessTokenJwt.value);

  const accessTokenExpiresAt = moment((accessToken.exp as number) * 1000);

  if (moment().add(1, "minute") <= accessTokenExpiresAt) {
    return;
  }

  const refreshTokenJwt = request.cookies.get(REFRESH_TOKEN_COOKIE_KEY);

  if (!refreshTokenJwt || !refreshTokenJwt.value) {
    clearAuth(response.cookies);

    return;
  }

  const refreshAuthResponse = await appFetch<AuthResponseDto>(
    "auth/refresh",
    {
      method: "POST",
      headers: {
        Cookie: `${REFRESH_TOKEN_COOKIE_KEY}=${refreshTokenJwt.value}`,
      },
    },
    response.cookies,
    response.headers,
  );

  if (!refreshAuthResponse.isSuccess && refreshAuthResponse.statusCode < 500) {
    clearAuth(response.cookies);

    return;
  }

  if (refreshAuthResponse.isSuccess) {
    setAccessToken(refreshAuthResponse.data.accessToken, response.cookies);
  }
}
