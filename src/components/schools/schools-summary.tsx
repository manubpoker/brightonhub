'use client';

import { StatusCard } from '@/components/shared/status-card';
import { GraduationCap } from 'lucide-react';
import type { SchoolsData } from '@/lib/transformers/schools';

interface SchoolsSummaryProps {
  data: SchoolsData | undefined;
  isLoading: boolean;
}

export function SchoolsSummary({ data, isLoading }: SchoolsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatusCard
        title="Total Schools"
        icon={GraduationCap}
        severity="normal"
        value={data ? `${data.totalCount}` : '...'}
        subtitle="In Brighton & Hove area"
        loading={isLoading}
      />
    </div>
  );
}
