'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { MarineData } from '@/lib/transformers/marine';

export const useMarine = createDataHook<MarineData>('marine', API_ROUTES.marine, POLLING.marine);
