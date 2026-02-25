'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { TrainData } from '@/lib/transformers/trains';

async function fetchTrains(): Promise<TrainData> {
  const res = await fetch(API_ROUTES.trains);
  if (!res.ok) throw new Error('Failed to fetch train data');
  return res.json();
}

export function useTrains() {
  return useQuery({
    queryKey: ['trains'],
    queryFn: fetchTrains,
    refetchInterval: POLLING.trains,
    staleTime: POLLING.trains / 2,
  });
}
