import { cookies, headers } from "next/headers";
import setCookieParser from "set-cookie-parser";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

import { ACCESS_TOKEN_COOKIE_KEY } from "@/services/auth.service";
import { CookiesStore } from "@/types/cookies-store";
import { HeadersStore } from "@/types/headers-store";
import { FORWARDED_FOR_HEADER_KEY } from "@/middleware";

export type FetchResponse<DataT = unknown> =
  | {
      isSuccess: true;
      data: DataT;
      error: null;
    }
  | {
      isSuccess: false;
      data: null;
      error: string;
    };

type RequestInput = RequestInfo | URL;
type RequestOptions<BodyT = unknown> = Omit<RequestInit, "body"> & {
  body?: BodyT;
};

export async function appFetch<ResponseT = unknown, BodyT = unknown>(
  input: RequestInput,
  options?: RequestOptions<BodyT>,
  cookiesStore?: CookiesStore,
  headersStore?: HeadersStore
): Promise<FetchResponse<ResponseT>> {
  cookiesStore = cookiesStore ?? cookies();
  headersStore = headersStore ?? headers();
  const nextResponseCookies = new ResponseCookies(headersStore as Headers);

  const refreshedAccessToken = nextResponseCookies.get(ACCESS_TOKEN_COOKIE_KEY);
  const accessToken = cookiesStore.get(ACCESS_TOKEN_COOKIE_KEY);
  const forwardedFor = headersStore.get(FORWARDED_FOR_HEADER_KEY) as string;

  const fetchResponse = await fetch(
    `${process.env.API_BASE_URL}/api/${input}`,
    {
      ...options,
      body: JSON.stringify(options?.body),
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${
          refreshedAccessToken?.value ?? accessToken?.value
        }`,
        "Content-Type": "application/json",
        "X-Forwarded-For": forwardedFor,
        ...options?.headers,
      },
    }
  );

  const fetchResponseCookiesHeader = fetchResponse.headers.get("Set-Cookie");

  if (fetchResponseCookiesHeader) {
    const fetchResponseCookies = setCookieParser(fetchResponseCookiesHeader);

    fetchResponseCookies.forEach((cookie) => {
      cookiesStore?.set({ ...cookie, sameSite: false });
    });
  }

  let fetchResponseBody = null;

  try {
    fetchResponseBody = await fetchResponse.json();
  } catch {
    fetchResponseBody = await fetchResponse.text();
  }

  if (fetchResponse.status >= 400) {
    return {
      isSuccess: false,
      data: null,
      error: fetchResponseBody?.message || fetchResponseBody,
    };
  }

  return {
    isSuccess: true,
    data: fetchResponseBody,
    error: null,
  };
}
