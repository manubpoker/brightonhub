'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { AirQualityData } from '@/lib/transformers/air-quality';

async function fetchAirQuality(): Promise<AirQualityData> {
  const res = await fetch(API_ROUTES.airQuality);
  if (!res.ok) throw new Error('Failed to fetch air quality data');
  return res.json();
}

export function useAirQuality() {
  return useQuery({
    queryKey: ['air-quality'],
    queryFn: fetchAirQuality,
    refetchInterval: POLLING.airQuality,
    staleTime: POLLING.airQuality / 2,
  });
}
