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

  const responseJson = await response.json();

  if (response.status >= 400 || response.status >= 500) {
    return {
      isSuccess: false,
      data: null,
      error: responseJson.message,
    };
  }

  return {
    isSuccess: true,
    data: responseJson,
    error: null,
  };
}
