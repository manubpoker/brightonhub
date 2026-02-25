'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { FloodWarningsData } from '@/lib/transformers/flood';
import type { FloodStationsData } from '@/lib/transformers/flood';

async function fetchFloodWarnings(): Promise<FloodWarningsData> {
  const res = await fetch(API_ROUTES.flood);
  if (!res.ok) throw new Error('Failed to fetch flood warnings');
  return res.json();
}

async function fetchFloodStations(): Promise<FloodStationsData> {
  const res = await fetch(API_ROUTES.floodStations);
  if (!res.ok) throw new Error('Failed to fetch flood stations');
  return res.json();
}

export function useFlood() {
  return useQuery({
    queryKey: ['flood-warnings'],
    queryFn: fetchFloodWarnings,
    refetchInterval: POLLING.flood,
    staleTime: POLLING.flood / 2,
  });
}

export function useFloodStations() {
  return useQuery({
    queryKey: ['flood-stations'],
    queryFn: fetchFloodStations,
    refetchInterval: POLLING.flood,
    staleTime: POLLING.flood / 2,
  });
}
