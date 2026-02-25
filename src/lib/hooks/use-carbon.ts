'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { CarbonData } from '@/lib/transformers/carbon';

async function fetchCarbon(): Promise<CarbonData> {
  const res = await fetch(API_ROUTES.carbon);
  if (!res.ok) throw new Error('Failed to fetch carbon data');
  return res.json();
}

export function useCarbon() {
  return useQuery({
    queryKey: ['carbon'],
    queryFn: fetchCarbon,
    refetchInterval: POLLING.carbon,
    staleTime: POLLING.carbon / 2,
  });
}
