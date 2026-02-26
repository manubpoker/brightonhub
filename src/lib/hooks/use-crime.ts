'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { CrimeData, NeighbourhoodData } from '@/lib/transformers/crime';

export const useCrime = createDataHook<CrimeData>('crime', API_ROUTES.crime, POLLING.crime);
export const useNeighbourhood = createDataHook<NeighbourhoodData>('crime-neighbourhood', API_ROUTES.crimeNeighbourhood, POLLING.crime);
