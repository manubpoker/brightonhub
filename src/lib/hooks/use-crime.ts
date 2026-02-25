'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { CrimeData, NeighbourhoodData } from '@/lib/transformers/crime';

async function fetchCrime(): Promise<CrimeData> {
  const res = await fetch(API_ROUTES.crime);
  if (!res.ok) throw new Error('Failed to fetch crime data');
  return res.json();
}

async function fetchNeighbourhood(): Promise<NeighbourhoodData> {
  const res = await fetch(API_ROUTES.crimeNeighbourhood);
  if (!res.ok) throw new Error('Failed to fetch neighbourhood data');
  return res.json();
}

export function useCrime() {
  return useQuery({
    queryKey: ['crime'],
    queryFn: fetchCrime,
    refetchInterval: POLLING.crime,
    staleTime: POLLING.crime / 2,
  });
}

export function useNeighbourhood() {
  return useQuery({
    queryKey: ['crime-neighbourhood'],
    queryFn: fetchNeighbourhood,
    refetchInterval: POLLING.crime,
    staleTime: POLLING.crime / 2,
  });
}
