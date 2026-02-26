'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { AirQualityData } from '@/lib/transformers/air-quality';

export const useAirQuality = createDataHook<AirQualityData>('air-quality', API_ROUTES.airQuality, POLLING.airQuality);
