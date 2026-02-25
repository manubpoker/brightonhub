'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { SchoolsData } from '@/lib/transformers/schools';

async function fetchSchools(): Promise<SchoolsData> {
  const res = await fetch(API_ROUTES.schools);
  if (!res.ok) throw new Error('Failed to fetch schools data');
  return res.json();
}

export function useSchools() {
  return useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchools,
    refetchInterval: POLLING.schools,
    staleTime: POLLING.schools / 2,
  });
}
