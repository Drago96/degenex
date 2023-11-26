import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { ZodSchema } from "zod";

export const useEventSourceQuery = <DataT = unknown>(
  queryKey: QueryKey,
  url: string,
  responseSchema?: ZodSchema,
) => {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchData = useCallback(() => {
    const eventSource = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("message", (event) => {
      const eventData = event.data && JSON.parse(event.data);

      if (eventData) {
        queryClient.setQueryData(
          queryKey,
          responseSchema ? responseSchema.parse(eventData) : eventData,
        );
      }
    });
  }, [queryClient, queryKey, url, responseSchema]);

  useEffect(() => {
    fetchData();

    return () => {
      eventSourceRef.current?.close();
    };
  }, [fetchData]);

  return useQuery<DataT | null>({ queryKey, refetchOnWindowFocus: false });
};
