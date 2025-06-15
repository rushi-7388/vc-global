
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { createThrottledRequest } from "@/utils/performanceOptimizations";
import { useMemo } from "react";

export const useThrottledQuery = <T = unknown>(
  options: UseQueryOptions<T> & { throttleDelay?: number }
) => {
  const { throttleDelay = 300, queryFn, ...restOptions } = options;

  const throttledQueryFn = useMemo(() => {
    if (!queryFn) return undefined;
    return createThrottledRequest(queryFn, throttleDelay);
  }, [queryFn, throttleDelay]);

  return useQuery({
    ...restOptions,
    queryFn: throttledQueryFn,
  });
};
