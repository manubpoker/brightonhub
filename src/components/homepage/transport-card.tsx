'use client';

import Link from 'next/link';
import { Train, Bus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrains } from '@/lib/hooks/use-trains';
import { StatusDot } from './status-dot';
import { cn } from '@/lib/utils';

const STATUS_STYLES = {
  'on-time': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  delayed: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
} as const;

const STATUS_LABELS = {
  'on-time': 'On time',
  delayed: 'Delayed',
  cancelled: 'Cancelled',
} as const;

export function TransportCard() {
  const { data, isLoading } = useTrains();

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Train className="h-4 w-4 text-amber-600" />
            Transport
          </CardTitle>
          {data && <StatusDot severity={data.severity} label="Live" />}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : data && data.departures.length > 0 ? (
          <>
            {data.departures.slice(0, 2).map((dep) => (
              <div
                key={dep.serviceId}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {dep.destination}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dep.scheduledTime}
                    {dep.platform && ` · Platform ${dep.platform}`}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn('shrink-0 text-[11px]', STATUS_STYLES[dep.status])}
                >
                  {STATUS_LABELS[dep.status]}
                  {dep.status === 'delayed' && dep.delayMinutes > 0 && (
                    <span className="ml-1">+{dep.delayMinutes}m</span>
                  )}
                </Badge>
              </div>
            ))}

            {/* Static bus row */}
            <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
              <Bus className="h-4 w-4 shrink-0" />
              <span>Brighton &amp; Hove Buses — Normal service</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-6 justify-center text-sm text-muted-foreground">
            <Train className="h-4 w-4" />
            No departure data available
          </div>
        )}

        <Link
          href="/transport"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View all transport <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
