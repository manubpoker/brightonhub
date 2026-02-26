'use client';

import { useTrains } from '@/lib/hooks/use-trains';
import { ErrorState } from '@/components/shared/error-state';
import { DepartureBoard } from '@/components/transport/departure-board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, BookOpen, ExternalLink } from 'lucide-react';
import { sanitizeApiHtml } from '@/lib/sanitize';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

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
      <Breadcrumbs items={[{ label: 'Transport', href: '/transport' }, { label: 'Train Departures' }]} />
      <div>
        <h1 className="text-2xl font-bold">Train Departures</h1>
        <p className="text-muted-foreground mt-1">
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
                className="text-sm text-muted-foreground rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 p-3"
                dangerouslySetInnerHTML={{ __html: sanitizeApiHtml(msg) }}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Understanding the Departure Board */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Reading the Departure Board
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            The departure board shows live train services from Brighton station. As a <strong>terminus</strong>,
            all trains originate here — the scheduled time is when the service is due to depart.
          </p>
          <p>
            <strong>Peak hours</strong> are roughly 07:00–09:00 and 16:30–19:00 on weekdays. Services to
            London run every few minutes during peaks. Off-peak tickets are valid on trains departing after
            09:30 (or 10:00 for some advance fares).
          </p>
          <p>
            Destinations and platform numbers build up over time as the system receives updates from the
            live Darwin feed. A service may initially show without a platform — this is normal and will
            update as the train approaches.
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
              { term: 'Scheduled', definition: 'The planned departure time from the timetable' },
              { term: 'Expected', definition: 'The real-time predicted departure time — may differ from scheduled if delayed' },
              { term: 'Platform', definition: 'The platform number the train will depart from (assigned closer to departure)' },
              { term: 'Calling at', definition: 'The intermediate stations the train will stop at on its journey' },
              { term: 'Terminus', definition: 'A station where the line ends — Brighton is a terminus, so all trains start or end here' },
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
              { label: 'National Rail Live Departures', url: 'https://www.nationalrail.co.uk/live-trains/departures/BTN/' },
              { label: 'Southern Railway', url: 'https://www.southernrailway.com/' },
              { label: 'Delay Repay Compensation', url: 'https://www.southernrailway.com/help-and-contact/delay-repay' },
              { label: 'Passenger Charter', url: 'https://www.southernrailway.com/help-and-contact/our-passenger-charter' },
              { label: 'Real Time Trains', url: 'https://www.realtimetrains.co.uk/search/simple/BTN' },
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
            Train data is sourced from the National Rail Darwin Push Port real-time feed.
            Departures update automatically every minute. Destinations build up over time
            as the system receives status updates from the live feed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
