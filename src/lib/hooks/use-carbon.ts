'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { CarbonData } from '@/lib/transformers/carbon';

export const useCarbon = createDataHook<CarbonData>('carbon', API_ROUTES.carbon, POLLING.carbon);
