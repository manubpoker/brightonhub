'use client';

import { StatusCard } from '@/components/shared/status-card';
import { Ticket, CalendarDays, Calendar } from 'lucide-react';
import type { EntertainmentData } from '@/lib/transformers/entertainment';

interface EntertainmentSummaryProps {
  data: EntertainmentData | undefined;
  isLoading: boolean;
}

export function EntertainmentSummary({ data, isLoading }: EntertainmentSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatusCard
        title="Today"
        icon={CalendarDays}
        severity="normal"
        value={data ? `${data.todayCount}` : '...'}
        subtitle="Events happening today"
        loading={isLoading}
      />
      <StatusCard
        title="This Week"
        icon={Calendar}
        severity="normal"
        value={data ? `${data.thisWeekCount}` : '...'}
        subtitle="Events in the next 7 days"
        loading={isLoading}
      />
      <StatusCard
        title="Total Listed"
        icon={Ticket}
        severity="normal"
        value={data ? `${data.totalCount}` : '...'}
        subtitle="Upcoming events near Brighton"
        loading={isLoading}
      />
    </div>
  );
}
