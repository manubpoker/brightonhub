'use client';

import { createDataHook } from './create-data-hook';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { CommunityData } from '@/lib/transformers/community';

export const useCommunity = createDataHook<CommunityData>('community', API_ROUTES.community, POLLING.community);
