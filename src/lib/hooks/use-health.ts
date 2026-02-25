'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { HealthData } from '@/lib/transformers/health';

async function fetchHealth(): Promise<HealthData> {
  const res = await fetch(API_ROUTES.health);
  if (!res.ok) throw new Error('Failed to fetch health data');
  return res.json();
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: POLLING.health,
    staleTime: POLLING.health / 2,
  });
}
