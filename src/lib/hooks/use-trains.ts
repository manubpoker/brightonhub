'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { TrainData } from '@/lib/transformers/trains';

export const useTrains = createDataHook<TrainData>('trains', API_ROUTES.trains, POLLING.trains);
