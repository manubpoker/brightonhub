'use client';

import Link from 'next/link';
import { Ticket, ArrowRight, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEntertainment } from '@/lib/hooks/use-entertainment';
import { StatusDot } from './status-dot';
import { format, parseISO } from 'date-fns';

export function EventsCard() {
  const { data, isLoading } = useEntertainment();

  const todayEvents = data?.events
    ?.filter((e) => {
      const today = new Date().toISOString().split('T')[0];
      return e.date === today;
    })
    .slice(0, 2) ?? [];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Ticket className="h-4 w-4 text-rose-600" />
            Events
          </CardTitle>
          <StatusDot severity="normal" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : data ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{data.todayCount} today</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{data.thisWeekCount} this week</span>
            </div>

            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-2.5 rounded-lg border px-3 py-2"
                >
                  <div className="flex flex-col items-center rounded bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 text-center shrink-0">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                      {format(parseISO(event.date), 'MMM')}
                    </span>
                    <span className="text-sm font-bold text-rose-700 dark:text-rose-300">
                      {format(parseISO(event.date), 'd')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{event.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{event.venue}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground">
                No events today — {data.thisWeekCount} coming this week
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">
            No events data available
          </div>
        )}

        <Link
          href="/entertainment"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View all events <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
