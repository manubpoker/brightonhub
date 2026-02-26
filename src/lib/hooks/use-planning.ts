'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { PlanningData } from '@/lib/transformers/planning';

export const usePlanning = createDataHook<PlanningData>('planning', API_ROUTES.planningApplications, POLLING.planning);
