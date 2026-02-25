'use client';

import { useAirQuality } from '@/lib/hooks/use-air-quality';
import { StatusCard } from '@/components/shared/status-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wind, Heart, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Severity } from '@/types/domain';

const bandColors: Record<string, string> = {
  Low: 'bg-green-100 text-green-700',
  Moderate: 'bg-yellow-100 text-yellow-700',
  High: 'bg-orange-100 text-orange-700',
  'Very High': 'bg-red-100 text-red-700',
};

const healthAdvice: Record<string, { general: string; atRisk: string }> = {
  Low: {
    general: 'Enjoy your usual outdoor activities.',
    atRisk: 'Enjoy your usual outdoor activities.',
  },
  Moderate: {
    general: 'Enjoy your usual outdoor activities.',
    atRisk: 'Adults and children with lung or heart problems should consider reducing strenuous physical exertion, particularly outdoors.',
  },
  High: {
    general: 'Anyone experiencing discomfort should consider reducing strenuous physical activity.',
    atRisk: 'Adults and children with lung or heart problems should reduce strenuous physical exertion, particularly outdoors. People with asthma may need to use their reliever inhaler more often.',
  },
  'Very High': {
    general: 'Reduce physical exertion, particularly outdoors, especially if you experience symptoms.',
    atRisk: 'Adults and children with lung or heart problems should avoid strenuous physical activity. People with asthma may find they need their reliever inhaler more often.',
  },
};

export default function AirQualityPage() {
  const { data, isLoading, isError } = useAirQuality();

  const reading = data?.reading;
  const alert = data?.alert;

  const overallBand = reading?.overallBand ?? 'Low';
  const overallSeverity: Severity = alert?.severity ?? 'normal';
  const advice = healthAdvice[overallBand] ?? healthAdvice.Low;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Air Quality</h1>
        <p className="text-gray-500 mt-1">
          Current air quality readings from monitoring stations near Brighton
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          title="Air Quality Index"
          icon={Wind}
          severity={overallSeverity}
          value={reading ? `${reading.overallIndex}/10` : 'N/A'}
          subtitle={reading ? `Band: ${reading.overallBand}` : 'No data available'}
          loading={isLoading}
          error={isError}
        />
        <StatusCard
          title="Station"
          icon={Wind}
          severity="normal"
          value={reading?.stationName ?? 'N/A'}
          subtitle="Nearest monitoring station"
          loading={isLoading}
          error={isError}
        />
        <StatusCard
          title="Pollutants Monitored"
          icon={Wind}
          severity="normal"
          value={reading ? `${reading.pollutants.length}` : '0'}
          subtitle="Active measurements"
          loading={isLoading}
          error={isError}
        />
      </div>

      {/* DAQI Scale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily Air Quality Index (DAQI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((index) => {
              const isActive = reading?.overallIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    'flex-1 h-10 flex items-center justify-center rounded text-xs font-bold transition-all',
                    index <= 3
                      ? 'bg-green-200 text-green-800'
                      : index <= 6
                        ? 'bg-yellow-200 text-yellow-800'
                        : index <= 9
                          ? 'bg-orange-200 text-orange-800'
                          : 'bg-red-200 text-red-800',
                    isActive && 'ring-2 ring-offset-1 ring-gray-900 scale-110'
                  )}
                >
                  {index}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Low (1-3)</span>
            <span>Moderate (4-6)</span>
            <span>High (7-9)</span>
            <span>Very High (10)</span>
          </div>
        </CardContent>
      </Card>

      {/* Pollutant readings */}
      {reading && reading.pollutants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Pollutant Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reading.pollutants.map((pollutant) => (
                <div
                  key={pollutant.name}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{pollutant.name}</p>
                    <p className="text-sm text-gray-500">
                      {pollutant.value != null
                        ? `${pollutant.value.toFixed(1)} ${pollutant.unit}`
                        : 'No data'}
                    </p>
                  </div>
                  <Badge className={cn(bandColors[pollutant.band] ?? bandColors.Low)}>
                    {pollutant.band} ({pollutant.index})
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health advice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="h-4 w-4" />
            Health Advice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">General population</p>
            <p className="text-sm text-gray-600 mt-1">{advice.general}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">At-risk groups</p>
            <p className="text-sm text-gray-600 mt-1">{advice.atRisk}</p>
          </div>
          {overallSeverity !== 'normal' && (
            <div className="flex items-start gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-3 mt-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
              <p className="text-sm text-yellow-800">
                Air quality is currently elevated. Sensitive groups should consider adjusting outdoor activities.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Air quality data is provided by{' '}
            <a
              href="https://uk-air.defra.gov.uk/"
              className="underline hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              DEFRA UK-AIR
            </a>{' '}
            via the 52North Timeseries API. Readings are updated hourly. The Daily Air Quality
            Index (DAQI) follows DEFRA guidelines and ranges from 1 (Low) to 10 (Very High).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
