'use client';

import type { WeatherDaily } from '@/types/domain';
import { format, parseISO } from 'date-fns';
import { Droplets, Wind, Sun } from 'lucide-react';

interface ForecastCardProps {
  day: WeatherDaily;
  isToday?: boolean;
}

export function ForecastCard({ day, isToday }: ForecastCardProps) {
  const date = parseISO(day.date);
  const dayLabel = isToday ? 'Today' : format(date, 'EEE');
  const dateLabel = format(date, 'd MMM');

  return (
    <div className="flex flex-col items-center rounded-lg border p-3 min-w-[100px]">
      <p className="text-sm font-semibold">{dayLabel}</p>
      <p className="text-xs text-gray-400">{dateLabel}</p>
      <p className="text-xs text-gray-500 mt-2 text-center leading-tight">
        {day.weatherDescription}
      </p>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-lg font-bold">{day.tempMax.toFixed(0)}°</span>
        <span className="text-sm text-gray-400">{day.tempMin.toFixed(0)}°</span>
      </div>
      <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Droplets className="h-3 w-3" />
          {day.precipProbability}%
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-3 w-3" />
          {day.windSpeedMax.toFixed(0)} km/h
        </div>
        <div className="flex items-center gap-1">
          <Sun className="h-3 w-3" />
          UV {day.uvIndexMax.toFixed(0)}
        </div>
      </div>
    </div>
  );
}
