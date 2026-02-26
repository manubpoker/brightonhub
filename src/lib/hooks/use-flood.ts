'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { FloodWarningsData, FloodStationsData } from '@/lib/transformers/flood';

export const useFlood = createDataHook<FloodWarningsData>('flood-warnings', API_ROUTES.flood, POLLING.flood);
export const useFloodStations = createDataHook<FloodStationsData>('flood-stations', API_ROUTES.floodStations, POLLING.flood);
