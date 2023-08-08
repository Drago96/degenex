import { cache } from "react";
import { cookies } from "next/headers";
import jwtDecode from "jwt-decode";

import { AccessTokenPayloadDto } from "@degenex/common";
import { CookiesStore } from "@/types/cookies-store";
import { ACCESS_TOKEN_COOKIE_KEY } from "./auth.service";

export const getCurrentUser = cache(async (cookiesStore?: CookiesStore) => {
  cookiesStore = cookiesStore ?? cookies();

  const accessTokenJwt = cookiesStore.get(ACCESS_TOKEN_COOKIE_KEY);

  if (!accessTokenJwt || !accessTokenJwt.value) {
    return null;
  }

  const accessToken = await jwtDecode<AccessTokenPayloadDto>(
    accessTokenJwt.value,
  );

  return {
    id: accessToken.sub,
    email: accessToken.email,
    roles: accessToken.roles,
  };
});
