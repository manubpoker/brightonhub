'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { HousingData } from '@/lib/transformers/housing';

async function fetchHousing(): Promise<HousingData> {
  const res = await fetch(API_ROUTES.housing);
  if (!res.ok) throw new Error('Failed to fetch housing data');
  return res.json();
}

export function useHousing() {
  return useQuery({
    queryKey: ['housing'],
    queryFn: fetchHousing,
    refetchInterval: POLLING.housing,
    staleTime: POLLING.housing / 2,
  });
}
