import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export const useEventSourceQuery = <DataT = unknown>(
  queryKey: QueryKey,
  url: string
) => {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const fetchData = () => {
    const eventSource = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("message", (event) => {
      const eventData = event.data && JSON.parse(event.data);

      if (eventData) {
        queryClient.setQueryData(queryKey, eventData);
      }
    });

    return null;
  };

  return useQuery<DataT | null>(queryKey, fetchData);
};
