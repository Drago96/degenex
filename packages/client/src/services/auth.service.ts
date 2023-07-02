import moment from "moment";
import { cookies } from "next/headers";

import { CookiesStore } from "@/types/cookies-store";

export const ACCESS_TOKEN_COOKIE_KEY = "access-token";
export const REFRESH_TOKEN_COOKIE_KEY = "refresh-token";

export const setAccessToken = (
  accessToken: string,
  cookiesStore?: CookiesStore
) => {
  cookiesStore = cookiesStore ?? cookies();

  cookiesStore.set(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: moment().add(7, "days").toDate(),
  });
};

export const clearAuth = (cookiesStore?: CookiesStore) => {
  cookiesStore = cookiesStore ?? cookies();

  cookiesStore.delete(ACCESS_TOKEN_COOKIE_KEY);
  cookiesStore.delete(REFRESH_TOKEN_COOKIE_KEY);
};
