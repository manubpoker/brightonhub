'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, POLLING } from '@/lib/constants';
import type { CommunityData } from '@/lib/transformers/community';

async function fetchCommunity(): Promise<CommunityData> {
  const res = await fetch(API_ROUTES.community);
  if (!res.ok) throw new Error('Failed to fetch community data');
  return res.json();
}

export function useCommunity() {
  return useQuery({
    queryKey: ['community'],
    queryFn: fetchCommunity,
    refetchInterval: POLLING.community,
    staleTime: POLLING.community / 2,
  });
}
