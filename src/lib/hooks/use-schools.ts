'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { SchoolsData } from '@/lib/transformers/schools';

export const useSchools = createDataHook<SchoolsData>('schools', API_ROUTES.schools, POLLING.schools);
