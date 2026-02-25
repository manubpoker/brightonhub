'use client';

import { StatusCard } from '@/components/shared/status-card';
import { Home, TrendingUp, TrendingDown } from 'lucide-react';
import type { HousingData } from '@/lib/transformers/housing';

interface HousingStatsProps {
  data: HousingData | undefined;
  isLoading: boolean;
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `£${(price / 1_000_000).toFixed(2)}m`;
  if (price >= 1_000) return `£${Math.round(price / 1_000)}k`;
  return `£${price}`;
}

export function HousingStats({ data, isLoading }: HousingStatsProps) {
  const change = data?.current.annualChangePercent ?? 0;
  const TrendIcon = change >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatusCard
        title="Average Price"
        icon={Home}
        severity="normal"
        value={data ? formatPrice(data.current.averagePrice) : '...'}
        subtitle="Brighton & Hove"
        loading={isLoading}
      />
      <StatusCard
        title="Annual Change"
        icon={TrendIcon}
        severity={data?.severity ?? 'normal'}
        value={data ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}%` : '...'}
        subtitle="Year-on-year change"
        loading={isLoading}
      />
      <StatusCard
        title="Data Period"
        icon={Home}
        severity="normal"
        value={data ? new Date(data.current.period).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '...'}
        subtitle="Most recent data"
        loading={isLoading}
      />
    </div>
  );
}
