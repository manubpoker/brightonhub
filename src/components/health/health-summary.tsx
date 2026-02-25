'use client';

import { StatusCard } from '@/components/shared/status-card';
import { HeartPulse, Pill, Building2, Stethoscope } from 'lucide-react';
import type { HealthData } from '@/lib/transformers/health';

interface HealthSummaryProps {
  data: HealthData | undefined;
  isLoading: boolean;
}

export function HealthSummary({ data, isLoading }: HealthSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard
        title="GP Practices"
        icon={HeartPulse}
        severity="normal"
        value={data ? `${data.counts.gps}` : '...'}
        subtitle="Active GP surgeries"
        loading={isLoading}
      />
      <StatusCard
        title="Pharmacies"
        icon={Pill}
        severity="normal"
        value={data ? `${data.counts.pharmacies}` : '...'}
        subtitle="Active pharmacies"
        loading={isLoading}
      />
      <StatusCard
        title="Hospitals"
        icon={Building2}
        severity="normal"
        value={data ? `${data.counts.hospitals}` : '...'}
        subtitle="NHS hospitals"
        loading={isLoading}
      />
      <StatusCard
        title="Dentists"
        icon={Stethoscope}
        severity="normal"
        value={data ? `${data.counts.dentists}` : '...'}
        subtitle="Dental practices"
        loading={isLoading}
      />
    </div>
  );
}
