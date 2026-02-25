'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { WeatherData } from '@/lib/transformers/weather';

async function fetchWeather(): Promise<WeatherData> {
  const res = await fetch(API_ROUTES.weather);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return res.json();
}

export function useWeather() {
  return useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeather,
    refetchInterval: POLLING.weather,
    staleTime: POLLING.weather / 2,
  });
}
