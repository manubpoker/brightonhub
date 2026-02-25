'use client';

import { useFlood, useFloodStations } from '@/lib/hooks/use-flood';
import { StatusCard } from '@/components/shared/status-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Waves, MapPin } from 'lucide-react';
import { cn, formatTimestamp, getSeverityTextClass } from '@/lib/utils';
import type { Severity } from '@/types/domain';

const severityBadgeClass: Record<Severity, string> = {
  severe: 'bg-red-100 text-red-700',
  warning: 'bg-orange-100 text-orange-700',
  alert: 'bg-yellow-100 text-yellow-700',
  normal: 'bg-green-100 text-green-700',
};

export default function FloodPage() {
  const { data: floodData, isLoading: warningsLoading, isError: warningsError } = useFlood();
  const { data: stationsData, isLoading: stationsLoading, isError: stationsError } = useFloodStations();

  const warnings = floodData?.warnings ?? [];
  const stations = stationsData?.stations ?? [];

  const activeWarnings = warnings.filter((w) => w.severity !== 'normal');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Flood Monitoring</h1>
        <p className="text-gray-500 mt-1">
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
            <p className="text-gray-500 py-8 text-center">
              Unable to load flood warnings. Please try again later.
            </p>
          ) : activeWarnings.length === 0 ? (
            <div className="py-8 text-center">
              <Waves className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-green-700">No Active Warnings</p>
              <p className="text-gray-500 mt-1">
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
                      <p className="text-sm text-gray-500 mt-1">{warning.area}</p>
                    </div>
                    <Badge className={severityBadgeClass[warning.severity]}>
                      {warning.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {warning.description}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
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
            <p className="text-gray-500 py-4 text-center">
              Unable to load station data.
            </p>
          ) : stations.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">No stations found.</p>
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
                      <td className="py-2.5 pr-4 text-gray-600">
                        {station.river || '\u2014'}
                      </td>
                      <td className="py-2.5 pr-4">
                        {station.latestValue != null ? (
                          <span className="font-mono">
                            {station.latestValue.toFixed(2)} {station.unit}
                          </span>
                        ) : (
                          <span className="text-gray-400">No data</span>
                        )}
                      </td>
                      <td className="py-2.5 text-gray-500">
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

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Flood monitoring data is provided by the{' '}
            <a
              href="https://environment.data.gov.uk/flood-monitoring/doc/reference"
              className="underline hover:text-gray-700"
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
