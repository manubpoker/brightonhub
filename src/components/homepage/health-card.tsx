'use client';

import Link from 'next/link';
import { HeartPulse, ArrowRight, Stethoscope, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useHealth } from '@/lib/hooks/use-health';
import { StatusDot } from './status-dot';

export function HealthCard() {
  const { data, isLoading } = useHealth();

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <HeartPulse className="h-4 w-4 text-pink-600" />
            Health
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
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
              <Stethoscope className="h-4 w-4 shrink-0 text-pink-500" />
              <div>
                <div className="text-sm font-medium">{data.counts.gps} GP Practices</div>
                <div className="text-xs text-muted-foreground">
                  {data.counts.pharmacies} pharmacies · {data.counts.dentists} dentists
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
              <Building2 className="h-4 w-4 shrink-0 text-blue-500" />
              <div>
                <div className="text-sm font-medium">{data.counts.hospitals} Hospitals</div>
                <div className="text-xs text-muted-foreground">Brighton &amp; Hove area</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">
            No health data available
          </div>
        )}

        <Link
          href="/health"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View health data <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
