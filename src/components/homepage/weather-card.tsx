'use client';

import Link from 'next/link';
import { CloudSun, Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudFog, Snowflake, Wind, Waves, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeather } from '@/lib/hooks/use-weather';
import { useMarine } from '@/lib/hooks/use-marine';
import { WMO_WEATHER_CODES } from '@/lib/constants';
import { StatusDot } from './status-dot';

const WEATHER_ICONS: Record<string, typeof Sun> = {
  'sun': Sun,
  'cloud-sun': CloudSun,
  'cloud': Cloud,
  'cloud-rain': CloudRain,
  'cloud-drizzle': CloudDrizzle,
  'cloud-lightning': CloudLightning,
  'cloud-fog': CloudFog,
  'snowflake': Snowflake,
};

function degToCompass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function WeatherCard() {
  const { data, isLoading } = useWeather();
  const { data: marineData } = useMarine();

  const current = data?.current;
  const today = data?.daily?.[0];
  const wmoEntry = current ? WMO_WEATHER_CODES[current.weatherCode] ?? WMO_WEATHER_CODES[0] : WMO_WEATHER_CODES[0];
  const WeatherIcon = WEATHER_ICONS[wmoEntry.icon] ?? Sun;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CloudSun className="h-4 w-4 text-sky-500" />
            Weather
          </CardTitle>
          {data && <StatusDot severity={data.severity} />}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : current ? (
          <>
            <div className="flex items-center gap-4">
              <WeatherIcon className="h-10 w-10 text-sky-500 shrink-0" />
              <div>
                <div className="text-3xl font-bold">{current.temperature.toFixed(1)}°C</div>
                <div className="text-sm text-muted-foreground">{current.weatherDescription}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className="text-lg font-bold flex items-center justify-center gap-1">
                  <Wind className="h-3.5 w-3.5" />
                  {current.windSpeed.toFixed(0)}
                </div>
                <div className="text-[10px] text-muted-foreground">km/h {degToCompass(current.windDirection)}</div>
              </div>
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className="text-lg font-bold">{current.humidity}%</div>
                <div className="text-[10px] text-muted-foreground">Humidity</div>
              </div>
              {today && (
                <div className="rounded-lg border px-2 py-1.5 text-center">
                  <div className="text-lg font-bold">{today.tempMax.toFixed(0)}°</div>
                  <div className="text-[10px] text-muted-foreground">High · {today.tempMin.toFixed(0)}° low</div>
                </div>
              )}
            </div>

            {marineData?.current && (
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <Waves className="h-4 w-4 text-cyan-500 shrink-0" />
                <div className="text-xs">
                  <span className="font-medium">{marineData.current.waveHeight.toFixed(1)}m waves</span>
                  <span className="text-muted-foreground"> · {marineData.current.swellHeight.toFixed(1)}m swell · {marineData.current.wavePeriod.toFixed(0)}s period</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">
            No weather data available
          </div>
        )}

        <Link
          href="/weather"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View full forecast <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
