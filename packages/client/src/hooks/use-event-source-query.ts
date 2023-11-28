import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ZodSchema } from "zod";

export const useEventSourceQuery = <DataT = unknown>(
  queryKey: QueryKey,
  url: string,
  responseSchema?: ZodSchema,
) => {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchData = async () => {
    eventSourceRef.current?.close();

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

    return null;
  };

  const { refetch, isLoading, ...query } = useQuery<DataT | null>({
    queryKey,
    queryFn: fetchData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }

    return () => {
      eventSourceRef.current?.close();
    };
  }, [refetch, isLoading]);

  return { refetch, isLoading, ...query };
};
