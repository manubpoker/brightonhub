'use client';

import Link from 'next/link';
import { Wind, Waves, Umbrella, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAirQuality } from '@/lib/hooks/use-air-quality';
import { useFlood } from '@/lib/hooks/use-flood';
import { useBathingWater } from '@/lib/hooks/use-bathing-water';
import { StatusDot } from './status-dot';
import { cn } from '@/lib/utils';
import type { Severity } from '@/types/domain';
import { Leaf } from 'lucide-react';

export function EnvironmentCard() {
  const airQuality = useAirQuality();
  const flood = useFlood();
  const bathingWater = useBathingWater();

  const isLoading = airQuality.isLoading || flood.isLoading || bathingWater.isLoading;

  // Compute worst severity
  const severities: Severity[] = [];
  if (airQuality.data?.alert) severities.push(airQuality.data.alert.severity);
  if (flood.data?.warnings?.length) {
    const worst = flood.data.warnings.reduce<Severity>((acc, w) =>
      ({ severe: 0, warning: 1, alert: 2, normal: 3 }[w.severity] < ({ severe: 0, warning: 1, alert: 2, normal: 3 }[acc]) ? w.severity : acc
    ), 'normal');
    severities.push(worst);
  }
  if (bathingWater.data) severities.push(bathingWater.data.severity);

  const order: Record<Severity, number> = { severe: 0, warning: 1, alert: 2, normal: 3 };
  const worstSeverity = severities.length > 0
    ? severities.sort((a, b) => order[a] - order[b])[0]
    : 'normal';

  const activeFloodCount = flood.data
    ? flood.data.warnings.filter((w) => w.severity !== 'normal').length
    : 0;

  const bestClassification = bathingWater.data?.beaches?.length
    ? bathingWater.data.beaches.reduce((best, b) => {
        const rank: Record<string, number> = { Excellent: 0, Good: 1, Sufficient: 2, Poor: 3 };
        return (rank[b.classification] ?? 99) < (rank[best] ?? 99) ? b.classification : best;
      }, bathingWater.data.beaches[0].classification)
    : null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Leaf className="h-4 w-4 text-green-600" />
            Environment
          </CardTitle>
          <StatusDot severity={worstSeverity} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            {/* Air Quality */}
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
              <Wind className="h-4 w-4 shrink-0 text-purple-500" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">Air Quality</div>
                <div className="text-sm font-medium">
                  {airQuality.data?.reading
                    ? `${airQuality.data.reading.overallBand} (${airQuality.data.reading.overallIndex} DAQI)`
                    : 'No data'}
                </div>
              </div>
            </div>

            {/* Flood Warnings */}
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
              <Waves className="h-4 w-4 shrink-0 text-blue-500" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">Flood Warnings</div>
                <div className={cn('text-sm font-medium', activeFloodCount > 0 && 'text-red-600 dark:text-red-400')}>
                  {activeFloodCount > 0
                    ? `${activeFloodCount} Active`
                    : 'None active'}
                </div>
              </div>
            </div>

            {/* Bathing Water */}
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
              <Umbrella className="h-4 w-4 shrink-0 text-cyan-500" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">Bathing Water</div>
                <div className="text-sm font-medium">
                  {bestClassification ?? 'No data'}
                </div>
              </div>
            </div>
          </>
        )}

        <Link
          href="/environment"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View environment data <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
