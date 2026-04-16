'use client';

import { useWeather } from '@/lib/hooks/use-weather';
import { StatusCard } from '@/components/shared/status-card';
import { ErrorState } from '@/components/shared/error-state';
import { RefreshButton } from '@/components/shared/refresh-button';
import { ForecastCard } from '@/components/weather/forecast-card';
import { SeaConditions } from '@/components/weather/sea-conditions';
import dynamic from 'next/dynamic';

const TimeSeriesChart = dynamic(
  () => import('@/components/charts/time-series-chart').then((m) => m.TimeSeriesChart),
  { ssr: false, loading: () => <div className="h-[250px] w-full animate-pulse rounded bg-muted" /> },
);
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Thermometer, Wind, Droplets, Sun, Sunrise, Sunset, Eye, Info, BookOpen, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Weather</h1>
          <p className="text-muted-foreground mt-1">
            Current conditions and 7-day forecast for Brighton &amp; Hove
          </p>
        </div>
        <RefreshButton className="mt-1" />
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
                <p className="text-xs text-muted-foreground">Precipitation</p>
              </div>
              <div className="text-center">
                <Eye className="h-5 w-5 text-muted-foreground mx-auto" />
                <p className="text-sm font-medium mt-1">{current.humidity}%</p>
                <p className="text-xs text-muted-foreground">Humidity</p>
              </div>
              <div className="text-center">
                <Sunrise className="h-5 w-5 text-orange-400 mx-auto" />
                <p className="text-sm font-medium mt-1">{format(parseISO(today.sunrise), 'HH:mm')}</p>
                <p className="text-xs text-muted-foreground">Sunrise</p>
              </div>
              <div className="text-center">
                <Sunset className="h-5 w-5 text-orange-600 mx-auto" />
                <p className="text-sm font-medium mt-1">{format(parseISO(today.sunset), 'HH:mm')}</p>
                <p className="text-xs text-muted-foreground">Sunset</p>
              </div>
              <div className="text-center">
                <Sun className="h-5 w-5 text-yellow-500 mx-auto" />
                <p className="text-sm font-medium mt-1">{today.uvIndexMax.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">UV Index</p>
              </div>
              <div className="text-center">
                <Wind className="h-5 w-5 text-muted-foreground mx-auto" />
                <p className="text-sm font-medium mt-1">{getWindDirection(current.windDirection)}</p>
                <p className="text-xs text-muted-foreground">Wind Direction</p>
              </div>
              <div className="text-center">
                <Thermometer className="h-5 w-5 text-red-400 mx-auto" />
                <p className="text-sm font-medium mt-1">{today.tempMax.toFixed(1)}°C</p>
                <p className="text-xs text-muted-foreground">Today&apos;s High</p>
              </div>
              <div className="text-center">
                <Thermometer className="h-5 w-5 text-blue-400 mx-auto" />
                <p className="text-sm font-medium mt-1">{today.tempMin.toFixed(1)}°C</p>
                <p className="text-xs text-muted-foreground">Today&apos;s Low</p>
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

      {/* Sea Conditions */}
      <SeaConditions />

      {/* Understanding Brighton's Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Brighton&apos;s Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton has a <strong>maritime climate</strong> with mild winters and warm summers. As a
            coastal city, temperatures tend to be moderated by the sea — cooler than inland in summer
            and warmer in winter. Expect more wind than inland areas, especially along the seafront.
          </p>
          <p>
            Average annual rainfall is around <strong>750mm</strong>, lower than the UK average. The
            sunniest months are May to August. Brighton is one of the sunniest cities in the UK, with
            over 1,700 hours of sunshine per year.
          </p>
          <p>
            The <strong>UV index</strong> can reach 7–8 in summer — sunscreen is recommended for beach
            days from April to September. Coastal fog (&quot;sea fret&quot;) is common in spring and early
            summer when warm air meets cold sea water.
          </p>
        </CardContent>
      </Card>

      {/* Key Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-purple-500" />
            Key Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { term: 'Apparent Temp', definition: 'The "feels like" temperature, accounting for wind chill and humidity effects on the body' },
              { term: 'UV Index', definition: 'A scale from 0–11+ measuring ultraviolet radiation strength — 6+ means high sun protection needed' },
              { term: 'WMO', definition: 'World Meteorological Organization — defines the standard weather codes used in the forecast' },
              { term: 'Wind Gusts', definition: 'Brief increases in wind speed above the sustained average — important for coastal safety' },
              { term: 'Swell', definition: 'Long-period waves generated by distant storms — affects sea conditions and beach safety in Brighton' },
              { term: 'Wave Period', definition: 'Time in seconds between successive wave crests — longer periods mean more powerful waves' },
              { term: 'Douglas Scale', definition: 'International sea state scale from 0 (calm) to 9 (phenomenal) based on wave height' },
              { term: 'ECMWF', definition: 'European Centre for Medium-Range Weather Forecasts — provides the forecast models used by Open-Meteo' },
            ].map(({ term, definition }) => (
              <div key={term} className="rounded-lg border p-3">
                <Badge variant="secondary" className="text-xs mb-1">{term}</Badge>
                <p className="text-xs text-muted-foreground">{definition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UV Index Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sun className="h-4 w-4 text-amber-500" />
            UV Index Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { level: '0–2 (Low)', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', note: 'No protection needed for most people' },
              { level: '3–5 (Moderate)', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', note: 'Wear sunscreen, seek shade during midday hours' },
              { level: '6–7 (High)', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', note: 'Sunscreen essential, hat and sunglasses recommended' },
              { level: '8+ (Very High)', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', note: 'Avoid midday sun, full protection needed — rare in Brighton' },
            ].map(({ level, color, note }) => (
              <div key={level} className="flex items-center gap-3 rounded-lg border p-3">
                <Badge className={color}>{level}</Badge>
                <span className="text-sm text-muted-foreground">{note}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Useful Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ExternalLink className="h-4 w-4 text-green-600" />
            Useful Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Met Office — Brighton', url: 'https://www.metoffice.gov.uk/weather/forecast/gcpchdrjz' },
              { label: 'Open-Meteo API', url: 'https://open-meteo.com/' },
              { label: 'BBC Weather — Brighton', url: 'https://www.bbc.co.uk/weather/2654710' },
              { label: 'Met Office UV Forecast', url: 'https://www.metoffice.gov.uk/weather/warnings-and-advice/uv-index' },
              { label: 'Tide Times — Brighton', url: 'https://www.tidetimes.org.uk/brighton-marina-tide-times' },
              { label: 'RNLI Beach Safety', url: 'https://rnli.org/find-my-nearest/beaches' },
            ].map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-3 text-sm text-blue-600 hover:bg-accent transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            Weather and marine data is provided by{' '}
            <a
              href="https://open-meteo.com/"
              className="underline hover:text-foreground"
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
