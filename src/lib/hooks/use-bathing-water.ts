'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { BathingWaterOverview } from '@/types/domain';

export const useBathingWater = createDataHook<BathingWaterOverview>('bathing-water', API_ROUTES.bathingWater, POLLING.bathingWater);
