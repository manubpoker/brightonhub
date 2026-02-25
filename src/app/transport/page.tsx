'use client';

import { useTrains } from '@/lib/hooks/use-trains';
import { StatusCard } from '@/components/shared/status-card';
import { ErrorState } from '@/components/shared/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, AlertTriangle, Bus } from 'lucide-react';
import Link from 'next/link';

export default function TransportPage() {
  const { data, isLoading, isError } = useTrains();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Transport</h1>
        <ErrorState message="Unable to load transport data. Please try again later." />
      </div>
    );
  }

  const departures = data?.departures ?? [];
  const disrupted = departures.filter((s) => s.status !== 'on-time').length;
  const cancelled = departures.filter((s) => s.status === 'cancelled').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transport</h1>
        <p className="text-gray-500 mt-1">
          Live train status and transport disruption alerts for Brighton
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          title="Train Services"
          icon={Train}
          severity={data?.severity ?? 'normal'}
          value={
            isLoading
              ? '...'
              : disrupted > 0
                ? `${disrupted} disrupted`
                : 'All on time'
          }
          subtitle={`${departures.length} departures from Brighton`}
          loading={isLoading}
        />
        <StatusCard
          title="Cancellations"
          icon={AlertTriangle}
          severity={cancelled > 0 ? 'severe' : 'normal'}
          value={isLoading ? '...' : `${cancelled}`}
          subtitle="Cancelled services"
          loading={isLoading}
        />
        <StatusCard
          title="Buses"
          icon={Bus}
          severity="normal"
          value="Coming Soon"
          subtitle="Bus data in a future update"
          loading={false}
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/transport/trains">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Train className="h-5 w-5 text-amber-600" />
                Live Train Departures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Full departure board with real-time updates from Brighton station
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bus className="h-5 w-5 text-gray-400" />
              Bus Services
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Bus service data will be added in a future update
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Disruption messages */}
      {data?.disruptions && data.disruptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Service Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.disruptions.map((msg, i) => (
              <div
                key={i}
                className="text-sm text-gray-600 rounded-lg bg-orange-50 border border-orange-100 p-3"
                dangerouslySetInnerHTML={{ __html: msg }}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
