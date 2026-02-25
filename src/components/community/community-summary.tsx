'use client';

import { StatusCard } from '@/components/shared/status-card';
import { HandHeart, AlertTriangle } from 'lucide-react';
import type { CommunityData } from '@/lib/transformers/community';

interface CommunitySummaryProps {
  data: CommunityData | undefined;
  isLoading: boolean;
}

export function CommunitySummary({ data, isLoading }: CommunitySummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatusCard
        title="Food Banks"
        icon={HandHeart}
        severity="normal"
        value={data ? `${data.totalBanks}` : '...'}
        subtitle="Near Brighton"
        loading={isLoading}
      />
      <StatusCard
        title="With Urgent Needs"
        icon={AlertTriangle}
        severity={data?.severity ?? 'normal'}
        value={data ? `${data.banksWithNeeds}` : '...'}
        subtitle="Currently requesting donations"
        loading={isLoading}
      />
    </div>
  );
}
