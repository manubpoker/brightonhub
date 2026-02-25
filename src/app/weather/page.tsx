'use client';

import { useWeather } from '@/lib/hooks/use-weather';
import { StatusCard } from '@/components/shared/status-card';
import { ErrorState } from '@/components/shared/error-state';
import { ForecastCard } from '@/components/weather/forecast-card';
import { TimeSeriesChart } from '@/components/charts/time-series-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Thermometer, Wind, Droplets, Sun, Sunrise, Sunset, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function WeatherPage() {
  const { data, isLoading, isError } = useWeather();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Weather</h1>
        <ErrorState message="Unable to load weather data. Please try again later." />
      </div>
    );
  }

  const current = data?.current;
  const daily = data?.daily ?? [];
  const hourly = data?.hourly ?? [];

  // Build temperature time series for next 24 hours
  const now = new Date();
  const tempSeries = hourly
    .filter((h) => {
      const t = new Date(h.time);
      return t >= now && t <= new Date(now.getTime() + 24 * 60 * 60 * 1000);
    })
    .map((h) => ({ timestamp: h.time, value: h.temperature }));

  const today = daily[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Weather</h1>
        <p className="text-gray-500 mt-1">
          Current conditions and 7-day forecast for Brighton & Hove
        </p>
      </div>

      {/* Current conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          title="Temperature"
          icon={Thermometer}
          severity={data?.severity ?? 'normal'}
          value={current ? `${current.temperature.toFixed(1)}°C` : '...'}
          subtitle={current ? `Feels like ${current.apparentTemperature.toFixed(1)}°C` : ''}
          loading={isLoading}
        />
        <StatusCard
          title="Conditions"
          icon={Cloud}
          severity="normal"
          value={current?.weatherDescription ?? '...'}
          subtitle={current ? `Humidity: ${current.humidity}%` : ''}
          loading={isLoading}
        />
        <StatusCard
          title="Wind"
          icon={Wind}
          severity={
            current && current.windGusts > 60 ? 'warning' : current && current.windGusts > 40 ? 'alert' : 'normal'
          }
          value={current ? `${current.windSpeed.toFixed(0)} km/h` : '...'}
          subtitle={current ? `Gusts: ${current.windGusts.toFixed(0)} km/h` : ''}
          loading={isLoading}
        />
      </div>

      {/* Current detail grid */}
      {current && today && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <Droplets className="h-5 w-5 text-blue-500 mx-auto" />
                <p className="text-sm font-medium mt-1">{current.precipitation.toFixed(1)} mm</p>
                <p className="text-xs text-gray-500">Precipitation</p>
              </div>
              <div className="text-center">
                <Eye className="h-5 w-5 text-gray-500 mx-auto" />
                <p className="text-sm font-medium mt-1">{current.humidity}%</p>
                <p className="text-xs text-gray-500">Humidity</p>
              </div>
              <div className="text-center">
                <Sunrise className="h-5 w-5 text-orange-400 mx-auto" />
                <p className="text-sm font-medium mt-1">{format(parseISO(today.sunrise), 'HH:mm')}</p>
                <p className="text-xs text-gray-500">Sunrise</p>
              </div>
              <div className="text-center">
                <Sunset className="h-5 w-5 text-orange-600 mx-auto" />
                <p className="text-sm font-medium mt-1">{format(parseISO(today.sunset), 'HH:mm')}</p>
                <p className="text-xs text-gray-500">Sunset</p>
              </div>
              <div className="text-center">
                <Sun className="h-5 w-5 text-yellow-500 mx-auto" />
                <p className="text-sm font-medium mt-1">{today.uvIndexMax.toFixed(0)}</p>
                <p className="text-xs text-gray-500">UV Index</p>
              </div>
              <div className="text-center">
                <Wind className="h-5 w-5 text-gray-500 mx-auto" />
                <p className="text-sm font-medium mt-1">{getWindDirection(current.windDirection)}</p>
                <p className="text-xs text-gray-500">Wind Direction</p>
              </div>
              <div className="text-center">
                <Thermometer className="h-5 w-5 text-red-400 mx-auto" />
                <p className="text-sm font-medium mt-1">{today.tempMax.toFixed(1)}°C</p>
                <p className="text-xs text-gray-500">Today&apos;s High</p>
              </div>
              <div className="text-center">
                <Thermometer className="h-5 w-5 text-blue-400 mx-auto" />
                <p className="text-sm font-medium mt-1">{today.tempMin.toFixed(1)}°C</p>
                <p className="text-xs text-gray-500">Today&apos;s Low</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 24-hour temperature chart */}
      {tempSeries.length > 0 && (
        <TimeSeriesChart
          title="24-Hour Temperature Forecast"
          data={tempSeries}
          unit="°C"
          color="#f59e0b"
          loading={isLoading}
        />
      )}

      {/* 7-day forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {daily.map((day, i) => (
              <ForecastCard key={day.date} day={day} isToday={i === 0} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Weather data is provided by{' '}
            <a
              href="https://open-meteo.com/"
              className="underline hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open-Meteo
            </a>{' '}
            using Met Office and ECMWF forecast models. Updated every 30 minutes.
            No API key required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const i = Math.round(degrees / 22.5) % 16;
  return dirs[i];
}
