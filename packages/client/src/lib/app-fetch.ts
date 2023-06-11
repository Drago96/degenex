import { cookies, headers } from "next/headers";
import setCookieParser from "set-cookie-parser";

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

export async function appFetch<DataT = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<FetchResponse<DataT>> {
  const cookieStore = cookies();
  const headersStore = headers();

  const accessToken = cookieStore.get("access-token");
  const forwardedFor = headersStore.get("x-forwarded-for") as string;

  const response = await fetch(`${process.env.API_BASE_URL}/api/${input}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken?.value}`,
      "Content-Type": "application/json",
      "X-Forwarded-For": forwardedFor,
      ...init?.headers,
    },
  });

  let responseBody = null;

  const responseCookiesHeader = response.headers.get("Set-Cookie");

  if (responseCookiesHeader) {
    const responseCookies = setCookieParser(responseCookiesHeader);

    responseCookies.forEach((cookie) => {
      cookieStore.set({ ...cookie, sameSite: false });
    });
  }

  try {
    responseBody = await response.json();
  } catch {
    responseBody = await response.text();
  }

  if (response.status >= 400) {
    return {
      isSuccess: false,
      data: null,
      error: responseBody?.message || responseBody,
    };
  }

  return {
    isSuccess: true,
    data: responseBody,
    error: null,
  };
}
