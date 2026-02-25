'use client';

import { useTrains } from '@/lib/hooks/use-trains';
import { ErrorState } from '@/components/shared/error-state';
import { DepartureBoard } from '@/components/transport/departure-board';
import { Card, CardContent } from '@/components/ui/card';

export default function TrainsPage() {
  const { data, isLoading, isError } = useTrains();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Train Departures</h1>
        <ErrorState message="Unable to load train data. Please try again later." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Train Departures</h1>
        <p className="text-gray-500 mt-1">
          Live departures from {data?.stationName ?? 'Brighton'} station
        </p>
      </div>

      <DepartureBoard
        departures={data?.departures ?? []}
        stationName={data?.stationName ?? 'Brighton'}
        loading={isLoading}
      />

      {/* Disruption messages */}
      {data?.disruptions && data.disruptions.length > 0 && (
        <Card>
          <CardContent className="py-4 space-y-2">
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

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Train data is sourced from the National Rail Darwin Push Port real-time feed.
            Departures update automatically every minute. Destinations build up over time
            as the system receives status updates from the live feed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
