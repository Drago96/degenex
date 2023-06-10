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
  const response = await fetch(input, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  let responseBody = null;

  try {
    responseBody = await response.json();
  } catch {
    responseBody = await response.text();
  }

  if (response.status >= 400 || response.status >= 500) {
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
