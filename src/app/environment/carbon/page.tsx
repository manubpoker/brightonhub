'use client';

import { useCarbon } from '@/lib/hooks/use-carbon';
import { GenerationMixChart } from '@/components/charts/generation-mix-chart';
import { TimeSeriesChart } from '@/components/charts/time-series-chart';
import { StatusCard } from '@/components/shared/status-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, TrendingDown, TrendingUp } from 'lucide-react';
import { CARBON_INDEX_TO_SEVERITY } from '@/lib/constants';
import { formatTimestamp } from '@/lib/utils';
import { ErrorState } from '@/components/shared/error-state';

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
      <div>
        <h1 className="text-2xl font-bold">Carbon Intensity</h1>
        <p className="text-gray-500 mt-1">
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

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Carbon intensity measures the amount of CO2 emissions produced per kilowatt hour of electricity consumed.
            Lower values mean cleaner electricity. Data is provided by{' '}
            <a
              href="https://carbonintensity.org.uk/"
              className="underline hover:text-gray-700"
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
