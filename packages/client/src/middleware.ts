import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import jwtDecode, { JwtPayload } from "jwt-decode";
import moment from "moment";

import { AuthResponseDto } from "@degenex/common";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  clearAuth,
  REFRESH_TOKEN_COOKIE_KEY,
  setAccessToken,
} from "./services/auth.service";
import { appFetch } from "./lib/app-fetch";


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};

export const middleware: NextMiddleware = async (request: NextRequest) => {
  const response = NextResponse.next();

  await refreshAuth(request, response);

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
    response.headers
  );
  
  if (!refreshAuthResponse.isSuccess) {
    clearAuth(response.cookies);

    return;
  }

  setAccessToken(refreshAuthResponse.data.accessToken, response.cookies);
}
