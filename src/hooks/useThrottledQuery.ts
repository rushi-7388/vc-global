
import { useQuery, UseQueryOptions, QueryFunction, QueryKey } from "@tanstack/react-query";
import { createThrottledRequest } from "@/utils/performanceOptimizations";
import { useMemo } from "react";

export const useThrottledQuery = <T = unknown, TQueryKey extends QueryKey = QueryKey>(
  options: UseQueryOptions<T, Error, T, TQueryKey> & { throttleDelay?: number }
) => {
  const { throttleDelay = 300, queryFn, ...restOptions } = options;

  const throttledQueryFn = useMemo(() => {
    if (!queryFn || typeof queryFn !== 'function') return undefined;
    return createThrottledRequest(queryFn as QueryFunction<T, TQueryKey>, throttleDelay);
  }, [queryFn, throttleDelay]);

  return useQuery({
    ...restOptions,
    queryFn: throttledQueryFn,
  });
};
