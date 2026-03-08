'use client';

import { useMarine } from '@/lib/hooks/use-marine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Navigation, Clock, ArrowDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import dynamic from 'next/dynamic';

const TimeSeriesChart = dynamic(
  () => import('@/components/charts/time-series-chart').then((m) => m.TimeSeriesChart),
  { ssr: false, loading: () => <div className="h-[250px] w-full animate-pulse rounded bg-muted" /> },
);

function getDirectionLabel(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(degrees / 22.5) % 16];
}

function getSeaStateLabel(height: number): string {
  if (height < 0.1) return 'Calm (glassy)';
  if (height < 0.5) return 'Calm (rippled)';
  if (height < 1.25) return 'Smooth';
  if (height < 2.5) return 'Slight';
  if (height < 4.0) return 'Moderate';
  if (height < 6.0) return 'Rough';
  return 'Very rough';
}

function getSeverityBadge(height: number) {
  if (height >= 4.0) return <Badge variant="destructive">Dangerous</Badge>;
  if (height >= 2.5) return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Rough</Badge>;
  if (height >= 1.5) return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Moderate</Badge>;
  return <Badge className="bg-green-500 text-white hover:bg-green-600">Calm</Badge>;
}

export function SeaConditions() {
  const { data, isLoading, isError } = useMarine();

  if (isError) return null;
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Waves className="h-4 w-4 text-cyan-500" />
            Sea Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { current, hourly, daily } = data;

  // Wave height forecast for next 24 hours
  const now = new Date();
  const waveSeries = hourly
    .filter((h) => {
      const t = new Date(h.time);
      return t >= now && t <= new Date(now.getTime() + 24 * 60 * 60 * 1000);
    })
    .map((h) => ({ timestamp: h.time, value: h.waveHeight }));

  return (
    <>
      {/* Current Sea Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Waves className="h-4 w-4 text-cyan-500" />
            Sea Conditions
            <span className="ml-auto">{getSeverityBadge(current.waveHeight)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <Waves className="h-5 w-5 text-cyan-500 mx-auto" />
              <p className="text-sm font-medium mt-1">{current.waveHeight.toFixed(1)} m</p>
              <p className="text-xs text-muted-foreground">Wave Height</p>
            </div>
            <div className="text-center">
              <Clock className="h-5 w-5 text-blue-500 mx-auto" />
              <p className="text-sm font-medium mt-1">{current.wavePeriod.toFixed(1)} s</p>
              <p className="text-xs text-muted-foreground">Wave Period</p>
            </div>
            <div className="text-center">
              <Navigation className="h-5 w-5 text-blue-400 mx-auto" style={{ transform: `rotate(${current.waveDirection}deg)` }} />
              <p className="text-sm font-medium mt-1">{getDirectionLabel(current.waveDirection)}</p>
              <p className="text-xs text-muted-foreground">Wave Direction</p>
            </div>
            <div className="text-center">
              <ArrowDown className="h-5 w-5 text-teal-500 mx-auto" />
              <p className="text-sm font-medium mt-1">{current.swellHeight.toFixed(1)} m</p>
              <p className="text-xs text-muted-foreground">Swell Height</p>
            </div>
            <div className="text-center">
              <Clock className="h-5 w-5 text-teal-400 mx-auto" />
              <p className="text-sm font-medium mt-1">{current.swellPeriod.toFixed(1)} s</p>
              <p className="text-xs text-muted-foreground">Swell Period</p>
            </div>
            <div className="text-center">
              <Navigation className="h-5 w-5 text-teal-400 mx-auto" style={{ transform: `rotate(${current.swellDirection}deg)` }} />
              <p className="text-sm font-medium mt-1">{getDirectionLabel(current.swellDirection)}</p>
              <p className="text-xs text-muted-foreground">Swell Direction</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Sea state: <strong>{getSeaStateLabel(current.waveHeight)}</strong> — Douglas Sea Scale
          </p>
        </CardContent>
      </Card>

      {/* 24-hour wave height chart */}
      {waveSeries.length > 0 && (
        <TimeSeriesChart
          title="24-Hour Wave Height Forecast"
          data={waveSeries}
          unit="m"
          color="#06b6d4"
          loading={isLoading}
        />
      )}

      {/* 7-day marine forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Waves className="h-4 w-4 text-cyan-500" />
            7-Day Sea Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {daily.map((day, i) => (
              <div
                key={day.date}
                className="flex flex-col items-center gap-1 rounded-lg border p-3 min-w-[100px]"
              >
                <p className="text-xs font-medium">
                  {i === 0 ? 'Today' : format(parseISO(day.date), 'EEE d')}
                </p>
                <Waves className="h-5 w-5 text-cyan-500" />
                <p className="text-sm font-bold">{day.waveHeightMax.toFixed(1)} m</p>
                <p className="text-xs text-muted-foreground">max waves</p>
                <p className="text-xs text-muted-foreground">
                  {getDirectionLabel(day.waveDirectionDominant)}
                </p>
                {day.swellHeightMax > 0 && (
                  <p className="text-xs text-teal-600">
                    {day.swellHeightMax.toFixed(1)} m swell
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
