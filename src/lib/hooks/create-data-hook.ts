'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchData<T>(route: string): Promise<T> {
  const res = await fetch(route);
  if (!res.ok) throw new Error(`Failed to fetch data from ${route}`);
  return res.json();
}

export function createDataHook<T>(key: string, route: string, interval: number) {
  return function useData() {
    return useQuery<T>({
      queryKey: [key],
      queryFn: () => fetchData<T>(route),
      refetchInterval: interval,
      staleTime: interval,
    });
  };
}
