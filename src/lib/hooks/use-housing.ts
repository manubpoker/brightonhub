'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { HousingData } from '@/lib/transformers/housing';

export const useHousing = createDataHook<HousingData>('housing', API_ROUTES.housing, POLLING.housing);
