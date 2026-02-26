'use client';

import { useFlood, useFloodStations } from '@/lib/hooks/use-flood';
import { StatusCard } from '@/components/shared/status-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Waves, MapPin, Info, BookOpen, ExternalLink } from 'lucide-react';
import { cn, formatTimestamp, getSeverityTextClass } from '@/lib/utils';
import type { Severity } from '@/types/domain';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

const severityBadgeClass: Record<Severity, string> = {
  severe: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  alert: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  normal: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function FloodPage() {
  const { data: floodData, isLoading: warningsLoading, isError: warningsError } = useFlood();
  const { data: stationsData, isLoading: stationsLoading, isError: stationsError } = useFloodStations();

  const warnings = floodData?.warnings ?? [];
  const stations = stationsData?.stations ?? [];

  const activeWarnings = warnings.filter((w) => w.severity !== 'normal');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Environment', href: '/environment' }, { label: 'Flood Monitoring' }]} />
      <div>
        <h1 className="text-2xl font-bold">Flood Monitoring</h1>
        <p className="text-muted-foreground mt-1">
          Flood warnings and river level monitoring stations within 25km of Brighton
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          title="Active Warnings"
          icon={Waves}
          severity={activeWarnings.length > 0 ? activeWarnings[0].severity : 'normal'}
          value={activeWarnings.length > 0 ? `${activeWarnings.length} Active` : 'None'}
          subtitle={
            activeWarnings.length > 0
              ? `Most severe: ${activeWarnings[0].title}`
              : 'No active flood warnings'
          }
          loading={warningsLoading}
          error={warningsError}
        />
        <StatusCard
          title="Monitoring Stations"
          icon={MapPin}
          severity="normal"
          value={stationsLoading ? '...' : `${stations.length}`}
          subtitle="Within 25km of Brighton"
          loading={stationsLoading}
          error={stationsError}
        />
        <StatusCard
          title="Area Coverage"
          icon={Waves}
          severity="normal"
          value="25km"
          subtitle="Brighton, Lewes, Newhaven, Shoreham"
          loading={false}
        />
      </div>

      {/* Active warnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Active Flood Warnings
            {activeWarnings.length > 0 && (
              <Badge variant="destructive">{activeWarnings.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {warningsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : warningsError ? (
            <p className="text-muted-foreground py-8 text-center">
              Unable to load flood warnings. Please try again later.
            </p>
          ) : activeWarnings.length === 0 ? (
            <div className="py-8 text-center">
              <Waves className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-green-700">No Active Warnings</p>
              <p className="text-muted-foreground mt-1">
                There are currently no flood warnings in the Brighton area.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeWarnings.map((warning) => (
                <div
                  key={warning.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className={cn('font-semibold', getSeverityTextClass(warning.severity))}>
                        {warning.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{warning.area}</p>
                    </div>
                    <Badge className={severityBadgeClass[warning.severity]}>
                      {warning.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {warning.description}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground/70">
                    <span>Raised: {formatTimestamp(warning.timeRaised)}</span>
                    {warning.timeUpdated && (
                      <span>Updated: {formatTimestamp(warning.timeUpdated)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monitoring stations */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Stations</CardTitle>
        </CardHeader>
        <CardContent>
          {stationsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : stationsError ? (
            <p className="text-muted-foreground py-4 text-center">
              Unable to load station data.
            </p>
          ) : stations.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">No stations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-4 font-medium">Station</th>
                    <th className="py-2 pr-4 font-medium">River</th>
                    <th className="py-2 pr-4 font-medium">Latest Reading</th>
                    <th className="py-2 font-medium">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {stations.map((station) => (
                    <tr key={station.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-4 font-medium">{station.name}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {station.river || '\u2014'}
                      </td>
                      <td className="py-2.5 pr-4">
                        {station.latestValue != null ? (
                          <span className="font-mono">
                            {station.latestValue.toFixed(2)} {station.unit}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/70">No data</span>
                        )}
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        {station.timestamp
                          ? formatTimestamp(station.timestamp)
                          : '\u2014'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Understanding Flood Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Flood Risk in Brighton
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton faces both <strong>coastal flood risk</strong> (storm surges and high tides) and{' '}
            <strong>river flood risk</strong> from the River Ouse and its tributaries — particularly around
            Lewes, which experienced severe flooding in <strong>October 2000</strong>.
          </p>
          <p>
            The Environment Agency operates monitoring stations along rivers and the coast within 25km of
            Brighton. Water levels are measured in <strong>metres above ordnance datum (mAOD)</strong> and
            updated every 15 minutes.
          </p>
          <p>
            Flood warnings are issued in three stages by the Environment Agency. If a warning is issued
            for your area, follow the advice given and monitor local conditions. Sign up for free flood
            warnings at gov.uk.
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
              { term: 'Severe Warning', definition: 'Severe flooding — danger to life. Issued for the most serious situations' },
              { term: 'Flood Warning', definition: 'Flooding is expected — act now. Move valuables upstairs, prepare to evacuate if advised' },
              { term: 'Flood Alert', definition: 'Flooding is possible — be prepared. Monitor levels and plan your response' },
              { term: 'mAOD', definition: 'Metres Above Ordnance Datum — the height measurement used for water levels relative to mean sea level' },
              { term: 'Catchment', definition: 'The area of land that drains into a particular river — determines how rainfall translates to river levels' },
            ].map(({ term, definition }) => (
              <div key={term} className="rounded-lg border p-3">
                <Badge variant="secondary" className="text-xs mb-1">{term}</Badge>
                <p className="text-xs text-muted-foreground">{definition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flood Warning Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Waves className="h-4 w-4 text-amber-500" />
            Warning Level Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { level: 'Severe Flood Warning', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', note: 'Danger to life — act immediately, follow emergency service advice' },
              { level: 'Flood Warning', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', note: 'Flooding expected — protect property, consider evacuation routes' },
              { level: 'Flood Alert', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', note: 'Flooding possible — stay aware, avoid low-lying footpaths and roads' },
              { level: 'No Warnings', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', note: 'No flooding expected — normal conditions' },
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
              { label: 'EA Flood Warnings', url: 'https://check-for-flooding.service.gov.uk/' },
              { label: 'Sign Up for Alerts', url: 'https://www.gov.uk/sign-up-for-flood-warnings' },
              { label: 'Long-term Flood Risk', url: 'https://check-long-term-flood-risk.service.gov.uk/' },
              { label: 'EA River Levels', url: 'https://check-for-flooding.service.gov.uk/river-and-sea-levels' },
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
            Flood monitoring data is provided by the{' '}
            <a
              href="https://environment.data.gov.uk/flood-monitoring/doc/reference"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Environment Agency Real Time Flood Monitoring API
            </a>
            . Water levels are updated every 15 minutes. Flood warnings are issued by the
            Environment Agency for England.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
