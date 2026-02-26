'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { WeatherData } from '@/lib/transformers/weather';

export const useWeather = createDataHook<WeatherData>('weather', API_ROUTES.weather, POLLING.weather);
