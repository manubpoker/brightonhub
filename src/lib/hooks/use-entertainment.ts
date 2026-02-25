'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { EntertainmentData } from '@/lib/transformers/entertainment';

async function fetchEntertainment(): Promise<EntertainmentData> {
  const res = await fetch(API_ROUTES.entertainment);
  if (!res.ok) throw new Error('Failed to fetch entertainment data');
  return res.json();
}

export function useEntertainment() {
  return useQuery({
    queryKey: ['entertainment'],
    queryFn: fetchEntertainment,
    refetchInterval: POLLING.entertainment,
    staleTime: POLLING.entertainment / 2,
  });
}
