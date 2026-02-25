'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { PlanningData } from '@/lib/transformers/planning';

async function fetchPlanning(): Promise<PlanningData> {
  const res = await fetch(API_ROUTES.planningApplications);
  if (!res.ok) throw new Error('Failed to fetch planning data');
  return res.json();
}

export function usePlanning() {
  return useQuery({
    queryKey: ['planning'],
    queryFn: fetchPlanning,
    refetchInterval: POLLING.planning,
    staleTime: POLLING.planning / 2,
  });
}
