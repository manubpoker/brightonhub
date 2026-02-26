'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { HealthData } from '@/lib/transformers/health';

export const useHealth = createDataHook<HealthData>('health', API_ROUTES.health, POLLING.health);
