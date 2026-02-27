'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Sun, Cloud, CloudSun, CloudRain, CloudDrizzle, CloudLightning, CloudFog, Snowflake, Wind, MapPin } from 'lucide-react';
import { useWeather } from '@/lib/hooks/use-weather';
import { WMO_WEATHER_CODES } from '@/lib/constants';
import { useArea } from './area-context';
import { Skeleton } from '@/components/ui/skeleton';

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

function useLiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function tick() {
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/London',
        }).format(new Date())
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function WeatherBar() {
  const { data, isLoading } = useWeather();
  const { area } = useArea();
  const clock = useLiveClock();

  if (isLoading || !data) {
    return (
      <div className="weather-gradient w-full px-4 py-3 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Skeleton className="h-5 w-48 bg-white/20" />
          <Skeleton className="h-5 w-32 bg-white/20" />
          <Skeleton className="h-5 w-36 bg-white/20" />
        </div>
      </div>
    );
  }

  const { current } = data;
  const wmoEntry = WMO_WEATHER_CODES[current.weatherCode] ?? WMO_WEATHER_CODES[0];
  const WeatherIcon = WEATHER_ICONS[wmoEntry.icon] ?? Sun;
  const compass = degToCompass(current.windDirection);

  return (
    <div className="weather-gradient w-full px-4 py-3 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2">
        {/* Left: weather info */}
        <div className="flex items-center gap-3 text-sm">
          <WeatherIcon className="h-5 w-5 shrink-0" />
          <span className="font-semibold text-base">
            {current.temperature.toFixed(1)}°C
          </span>
          <span className="hidden sm:inline text-white/90">
            {current.weatherDescription}
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-white/80">
            <Wind className="h-3.5 w-3.5" />
            {current.windSpeed.toFixed(0)} km/h {compass}
          </span>
        </div>

        {/* Center: date & clock */}
        <div className="text-sm text-white/90 text-center order-last sm:order-none w-full sm:w-auto">
          <span>{format(new Date(), 'EEEE, d MMMM yyyy')}</span>
          <span className="ml-2 font-mono tabular-nums">{clock}</span>
        </div>

        {/* Right: location + area badge */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-white/80" />
          <span className="hidden sm:inline text-white/90">Brighton &amp; Hove</span>
          <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold">
            {area === 'ALL' ? 'ALL' : area}
          </span>
        </div>
      </div>
    </div>
  );
}
