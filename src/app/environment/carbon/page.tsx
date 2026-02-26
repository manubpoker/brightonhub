'use client';

import { useCarbon } from '@/lib/hooks/use-carbon';
import dynamic from 'next/dynamic';

const GenerationMixChart = dynamic(
  () => import('@/components/charts/generation-mix-chart').then((m) => m.GenerationMixChart),
  { ssr: false, loading: () => <div className="h-[250px] w-full animate-pulse rounded bg-muted" /> },
);
const TimeSeriesChart = dynamic(
  () => import('@/components/charts/time-series-chart').then((m) => m.TimeSeriesChart),
  { ssr: false, loading: () => <div className="h-[250px] w-full animate-pulse rounded bg-muted" /> },
);
import { StatusCard } from '@/components/shared/status-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, TrendingDown, TrendingUp, Info, BookOpen, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CARBON_INDEX_TO_SEVERITY } from '@/lib/constants';
import { formatTimestamp } from '@/lib/utils';
import { ErrorState } from '@/components/shared/error-state';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function CarbonPage() {
  const { data, isLoading, isError } = useCarbon();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Carbon Intensity</h1>
        <ErrorState message="Unable to load carbon intensity data. Please try again later." />
      </div>
    );
  }

  const current = data?.current;
  const forecast = data?.forecast ?? [];

  // Build forecast time series
  const forecastSeries = forecast.map((f) => ({
    timestamp: f.from,
    value: f.forecast,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Environment', href: '/environment' }, { label: 'Carbon Intensity' }]} />
      <div>
        <h1 className="text-2xl font-bold">Carbon Intensity</h1>
        <p className="text-muted-foreground mt-1">
          Real-time carbon intensity of electricity generation for the Brighton region (South England)
        </p>
      </div>

      {/* Current status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          title="Current Intensity"
          icon={Zap}
          severity={
            current
              ? (CARBON_INDEX_TO_SEVERITY[current.index.toLowerCase()] ?? 'normal')
              : 'normal'
          }
          value={current ? `${current.forecast} gCO2/kWh` : 'Loading...'}
          subtitle={current ? `Index: ${current.index}` : ''}
          loading={isLoading}
        />
        <StatusCard
          title="Trend"
          icon={
            forecast.length >= 2 && forecast[1].forecast > forecast[0].forecast
              ? TrendingUp
              : TrendingDown
          }
          severity="normal"
          value={
            forecast.length >= 2
              ? forecast[1].forecast > forecast[0].forecast
                ? 'Rising'
                : 'Falling'
              : 'N/A'
          }
          subtitle="Next 30 min direction"
          loading={isLoading}
        />
        <StatusCard
          title="Period"
          icon={Zap}
          severity="normal"
          value={current ? formatTimestamp(current.from).split(',')[1]?.trim() ?? '' : ''}
          subtitle={current ? `Until ${formatTimestamp(current.to).split(',')[1]?.trim() ?? ''}` : ''}
          loading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {current?.generationMix ? (
          <GenerationMixChart data={current.generationMix} loading={isLoading} />
        ) : (
          <GenerationMixChart data={[]} loading={isLoading} />
        )}

        <TimeSeriesChart
          title="24-Hour Intensity Forecast"
          data={forecastSeries}
          unit="gCO2/kWh"
          color="#22c55e"
          loading={isLoading}
        />
      </div>

      {/* Generation mix table */}
      {current?.generationMix && current.generationMix.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generation Mix Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {current.generationMix
                .sort((a, b) => b.perc - a.perc)
                .map((g) => (
                  <div
                    key={g.fuel}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="text-sm capitalize">{g.fuel}</span>
                    <span className="text-sm font-semibold">
                      {g.perc.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Understanding Carbon Intensity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Carbon Intensity
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Carbon intensity measures grams of CO2 emitted per kilowatt-hour of electricity generated.
            Brighton falls within the <strong>South England</strong> region of the National Grid, which
            includes power from local solar, offshore wind, and the Dungeness nuclear plant.
          </p>
          <p>
            Intensity varies throughout the day — it&apos;s typically <strong>lowest overnight and in early
            afternoon</strong> (when demand is low and renewables are strong) and <strong>highest in the
            early evening</strong> when gas plants ramp up to meet peak demand.
          </p>
          <p>
            You can reduce your carbon footprint by running energy-intensive appliances (washing machines,
            dishwashers, EV charging) during low-intensity periods, when the grid is cleanest.
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
              { term: 'gCO\u2082/kWh', definition: 'Grams of carbon dioxide per kilowatt-hour — the standard unit for carbon intensity' },
              { term: 'Carbon Intensity', definition: 'How much CO2 is produced per unit of electricity — lower is cleaner' },
              { term: 'Generation Mix', definition: 'The breakdown of energy sources (gas, wind, solar, nuclear, etc.) powering the grid right now' },
              { term: 'Very Low', definition: 'Under 50 gCO2/kWh — grid is very clean, mostly renewables and nuclear' },
              { term: 'Low', definition: '50–100 gCO2/kWh — good time to use electricity-intensive appliances' },
              { term: 'High', definition: 'Over 200 gCO2/kWh — grid is relying heavily on gas generation' },
            ].map(({ term, definition }) => (
              <div key={term} className="rounded-lg border p-3">
                <Badge variant="secondary" className="text-xs mb-1">{term}</Badge>
                <p className="text-xs text-muted-foreground">{definition}</p>
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
              { label: 'Carbon Intensity API', url: 'https://carbonintensity.org.uk/' },
              { label: 'National Grid ESO', url: 'https://www.nationalgrideso.com/' },
              { label: 'Energy Dashboard (Grid)', url: 'https://grid.iamkate.com/' },
              { label: 'BEIS Emissions Data', url: 'https://www.gov.uk/government/collections/uk-greenhouse-gas-emissions' },
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
            Carbon intensity measures the amount of CO2 emissions produced per kilowatt hour of electricity consumed.
            Lower values mean cleaner electricity. Data is provided by{' '}
            <a
              href="https://carbonintensity.org.uk/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              National Grid ESO
            </a>{' '}
            and updated every 30 minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
