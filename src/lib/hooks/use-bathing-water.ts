'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { BathingWaterOverview } from '@/types/domain';

async function fetchBathingWater(): Promise<BathingWaterOverview> {
  const res = await fetch(API_ROUTES.bathingWater);
  if (!res.ok) throw new Error('Failed to fetch bathing water data');
  return res.json();
}

export function useBathingWater() {
  return useQuery({
    queryKey: ['bathing-water'],
    queryFn: fetchBathingWater,
    refetchInterval: POLLING.bathingWater,
    staleTime: POLLING.bathingWater / 2,
  });
}
