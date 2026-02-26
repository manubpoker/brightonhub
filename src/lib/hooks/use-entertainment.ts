'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { EntertainmentData } from '@/lib/transformers/entertainment';

export const useEntertainment = createDataHook<EntertainmentData>('entertainment', API_ROUTES.entertainment, POLLING.entertainment);
