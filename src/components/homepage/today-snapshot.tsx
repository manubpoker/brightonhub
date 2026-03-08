'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Train, Waves, CloudSun, Wind, Shield, ArrowRight } from 'lucide-react';
import { useAirQuality } from '@/lib/hooks/use-air-quality';
import { useCrime } from '@/lib/hooks/use-crime';
import { useFlood } from '@/lib/hooks/use-flood';
import { useWeather } from '@/lib/hooks/use-weather';
import { useTrains } from '@/lib/hooks/use-trains';
import { useArea } from './area-context';
import type { ReactNode } from 'react';

type SnapshotTone = 'normal' | 'alert' | 'warning' | 'severe';

const TONE_STYLES: Record<SnapshotTone, string> = {
  normal: 'bg-green-500/10 text-green-700 border-green-200/70 dark:border-green-800/70 dark:text-green-300',
  alert: 'bg-yellow-500/10 text-yellow-700 border-yellow-200/70 dark:border-yellow-800/70 dark:text-yellow-300',
  warning: 'bg-orange-500/10 text-orange-700 border-orange-200/70 dark:border-orange-800/70 dark:text-orange-300',
  severe: 'bg-red-500/10 text-red-700 border-red-200/70 dark:border-red-800/70 dark:text-red-300',
};

const SNAPSHOT_LEGEND: Array<{ tone: SnapshotTone; label: string }> = [
  { tone: 'normal', label: 'Normal' },
  { tone: 'alert', label: 'Attention' },
  { tone: 'warning', label: 'Warning' },
  { tone: 'severe', label: 'Severe' },
];

interface SnapshotItem {
  tone: SnapshotTone;
  text: string;
  link: string;
  icon: ReactNode;
}

function getUpdatedLabel(timestamp?: number): string {
  if (!timestamp) return 'not updated yet';
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

function getCrimeToneForArea(count: number, average: number): SnapshotTone {
  if (!count || !average) return 'normal';
  if (count >= average * 1.6) return 'warning';
  if (count >= average * 1.25) return 'alert';
  return 'normal';
}

export function TodaySnapshot() {
  const flood = useFlood();
  const airQuality = useAirQuality();
  const crime = useCrime();
  const weather = useWeather();
  const trains = useTrains();
  const { area } = useArea();

  const loading =
    flood.isLoading ||
    airQuality.isLoading ||
    weather.isLoading ||
    trains.isLoading ||
    crime.isLoading;

  if (loading || (!weather.data && !flood.data && !airQuality.data && !trains.data && !crime.data)) {
    return (
      <Card className="border-l-4 border-l-primary/40">
        <CardContent className="space-y-2 py-4">
          <Skeleton className="h-5 w-40" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-7 w-40" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const snapshotItems: SnapshotItem[] = [];

  if (weather.data?.current) {
    const uvIndexMax = weather.data.daily[0]?.uvIndexMax ?? 0;
    snapshotItems.push({
      tone: uvIndexMax > 7 ? 'warning' : 'normal',
      text: `Weather: ${weather.data.current.weatherDescription} · ${weather.data.current.temperature.toFixed(1)}°C · UV ${uvIndexMax.toFixed(0)}`,
      link: '/weather',
      icon: <CloudSun className="h-3.5 w-3.5" />,
    });
  }

  const activeWarnings = flood.data?.warnings.filter((warning) => warning.severity !== 'normal') ?? [];
  snapshotItems.push({
    tone: activeWarnings.length > 0 ? 'severe' : 'normal',
    text: activeWarnings.length > 0
      ? `${activeWarnings.length} active flood warning${activeWarnings.length > 1 ? 's' : ''}`
      : 'No active flood warnings',
    link: '/environment/flood',
    icon: <Waves className="h-3.5 w-3.5" />,
  });

  const disruptedServices = trains.data?.departures.filter((s) => s.status !== 'on-time') ?? [];
  snapshotItems.push({
    tone: disruptedServices.length > 2 ? 'warning' : disruptedServices.length > 0 ? 'alert' : 'normal',
    text:
      disruptedServices.length > 0
        ? `${disruptedServices.length} service${disruptedServices.length > 1 ? 's' : ''} with delays/cancellations at Brighton station`
        : 'Train services on track',
    link: '/transport',
    icon: <Train className="h-3.5 w-3.5" />,
  });

  const areaSummary = crime.data?.summary;
  if (areaSummary) {
    const areaBreakdown = areaSummary.areaBreakdown ?? [];
    const selectedAreaCount =
      area === 'ALL'
        ? areaSummary.totalCrimes
        : areaBreakdown.find((entry) => entry.area === area)?.count ?? 0;

    const averageAreaCount =
      areaBreakdown.length > 0
        ? areaBreakdown.reduce((acc, entry) => acc + entry.count, 0) / areaBreakdown.length
        : selectedAreaCount;

    const areaLabel = area === 'ALL' ? 'all areas' : `${area}`;
    const tone = area === 'ALL'
      ? areaSummary.severity
      : getCrimeToneForArea(selectedAreaCount, averageAreaCount);

    snapshotItems.push({
      tone,
      text: `Crime (${areaLabel}): ${selectedAreaCount.toLocaleString()} incidents ${area === 'ALL' ? `for ${areaSummary.month}` : 'selected area'}`,
      link: '/crime',
      icon: <Shield className="h-3.5 w-3.5" />,
    });
  }

  if (airQuality.data?.reading) {
    const aqTone = airQuality.data.alert?.severity ?? 'normal';
    snapshotItems.push({
      tone: aqTone === 'normal' ? 'normal' : aqTone,
      text: `Air quality: ${airQuality.data.reading.overallBand} (DAQI ${airQuality.data.reading.overallIndex}/10)`,
      link: '/environment/air-quality',
      icon: <Wind className="h-3.5 w-3.5" />,
    });
  }

  const affectedLinks = Array.from(
    new Set(
      snapshotItems
        .filter((item) => item.tone !== 'normal')
        .map((item) => item.link)
    )
  );

  const lastUpdated = [
    ['Flood', flood.dataUpdatedAt],
    ['Weather', weather.dataUpdatedAt],
    ['Transport', trains.dataUpdatedAt],
    ['Air quality', airQuality.dataUpdatedAt],
    ['Crime', crime.dataUpdatedAt],
  ] as const;

  if (snapshotItems.length === 0) {
    return (
      <Card className="border-l-4 border-l-primary/40">
        <CardContent className="space-y-2 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Today&apos;s Snapshot</p>
          <p className="text-sm text-muted-foreground">No live snapshot items available right now.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardContent className="py-4">
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Today&apos;s Snapshot</p>
        </div>

        <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
          {SNAPSHOT_LEGEND.map((item) => (
            <span
              key={item.tone}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 ${TONE_STYLES[item.tone]}`}
            >
              {item.label}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {snapshotItems.map((item, i) => (
            <Link
              href={item.link}
              key={`${item.link}-${i}`}
              className="inline-flex"
            >
              <Badge
                variant="outline"
                className={`inline-flex items-center gap-1.5 rounded-md border ${TONE_STYLES[item.tone]}`}
              >
                {item.icon}
                {item.text}
              </Badge>
            </Link>
          ))}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Last updated:
          <span className="ml-1 inline-flex flex-wrap gap-x-3 gap-y-1">
            {lastUpdated.map(([label, timestamp]) => (
              <span key={label} className="whitespace-nowrap">
                {label} {getUpdatedLabel(timestamp)}
              </span>
            ))}
          </span>
        </p>

        {affectedLinks.length >= 2 && (
          <button
            type="button"
            onClick={() => {
              affectedLinks.forEach((path) => {
                const targetUrl = `${window.location.origin}${path}`;
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
              });
            }}
            aria-label="Open all affected dashboards in new tabs"
            className="mt-3 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent"
          >
            <ArrowRight className="h-3 w-3" />
            Open all affected dashboards
          </button>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Tap any card to open the full dashboard.
        </p>
      </CardContent>
    </Card>
  );
}
