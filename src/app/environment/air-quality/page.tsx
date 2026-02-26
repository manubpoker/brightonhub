'use client';

import { useAirQuality } from '@/lib/hooks/use-air-quality';
import { StatusCard } from '@/components/shared/status-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wind, Heart, AlertTriangle, Info, BookOpen, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Severity } from '@/types/domain';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

const bandColors: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Moderate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Very High': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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
      <Breadcrumbs items={[{ label: 'Environment', href: '/environment' }, { label: 'Air Quality' }]} />
      <div>
        <h1 className="text-2xl font-bold">Air Quality</h1>
        <p className="text-muted-foreground mt-1">
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
                    isActive && 'ring-2 ring-offset-1 ring-foreground scale-110'
                  )}
                >
                  {index}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground">
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
            <p className="text-sm font-medium text-foreground">General population</p>
            <p className="text-sm text-muted-foreground mt-1">{advice.general}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">At-risk groups</p>
            <p className="text-sm text-muted-foreground mt-1">{advice.atRisk}</p>
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

      {/* Understanding Air Quality in Brighton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Air Quality in Brighton
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton&apos;s main monitoring station is part of the <strong>Automatic Urban and Rural
            Network (AURN)</strong>, the UK&apos;s largest automatic air quality monitoring network.
            The station measures key pollutants including NO2, PM2.5, PM10, and ozone.
          </p>
          <p>
            <strong>Nitrogen dioxide (NO2)</strong> from road traffic is Brighton&apos;s primary air quality
            concern. The council has designated several <strong>Air Quality Management Areas (AQMAs)</strong>{' '}
            where pollution exceeds national objectives, particularly along busy corridors like the A270.
          </p>
          <p>
            Air quality tends to be worse during rush hours and on calm, warm days when pollutants
            don&apos;t disperse. Coastal breezes generally help ventilate the city, especially along the
            seafront.
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
              { term: 'DAQI', definition: 'Daily Air Quality Index — DEFRA\'s 1–10 scale summarising overall air pollution risk' },
              { term: 'NO\u2082', definition: 'Nitrogen dioxide — mainly from vehicle exhaust, can worsen respiratory conditions' },
              { term: 'PM2.5', definition: 'Fine particulate matter under 2.5 microns — can penetrate deep into the lungs and bloodstream' },
              { term: 'PM10', definition: 'Particulate matter under 10 microns — includes dust, pollen, and combustion particles' },
              { term: 'O\u2083', definition: 'Ground-level ozone — formed by sunlight reacting with NOx and VOCs, higher in summer' },
              { term: 'SO\u2082', definition: 'Sulphur dioxide — from industrial sources, now rare in Brighton but still monitored' },
              { term: 'AURN', definition: 'Automatic Urban and Rural Network — DEFRA\'s national network of ~170 monitoring stations' },
              { term: 'AQMA', definition: 'Air Quality Management Area — zones where pollution exceeds national standards, triggering action plans' },
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
              { label: 'DEFRA UK-AIR', url: 'https://uk-air.defra.gov.uk/' },
              { label: 'Brighton AQMA Reports', url: 'https://www.brighton-hove.gov.uk/environment/air-quality' },
              { label: 'AURN Station Data', url: 'https://uk-air.defra.gov.uk/networks/network-info?view=aurn' },
              { label: 'DAQI Health Advice', url: 'https://uk-air.defra.gov.uk/air-pollution/daqi' },
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
            Air quality data is provided by{' '}
            <a
              href="https://uk-air.defra.gov.uk/"
              className="underline hover:text-foreground"
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
