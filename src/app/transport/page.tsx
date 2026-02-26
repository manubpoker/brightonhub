'use client';

import { useTrains } from '@/lib/hooks/use-trains';
import { StatusCard } from '@/components/shared/status-card';
import { ErrorState } from '@/components/shared/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, AlertTriangle, Bus, Info, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';

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
        <p className="text-muted-foreground mt-1">
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
              <p className="text-sm text-muted-foreground">
                Full departure board with real-time updates from Brighton station
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bus className="h-5 w-5 text-muted-foreground/70" />
              Bus Services
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground/70">
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
                className="text-sm text-muted-foreground rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 p-3"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg) }}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Understanding Transport in Brighton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Transport in Brighton
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Brighton station</strong> (CRS code: BTN) is a terminus — all trains start or end here.
            It&apos;s served by <strong>Southern</strong> and <strong>Thameslink</strong> (both part of
            Govia Thameslink Railway). Key routes run to London Victoria (~60 min), London Bridge, Gatwick
            Airport, and along the coast to Worthing, Lewes, and Eastbourne.
          </p>
          <p>
            Train data comes from the <strong>National Rail Darwin Push Port</strong>, a real-time feed
            that provides schedule, status, and platform information. The departure board updates
            automatically as new data arrives from the feed.
          </p>
          <p>
            <strong>Brighton &amp; Hove Buses</strong> operates most local routes. The 1, 1A, 5, 7, and 25
            are among the busiest routes. Night buses (N5, N7, N25) run on Friday and Saturday nights.
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
              { term: 'CRS', definition: 'Computer Reservation System — the 3-letter station code (e.g. BTN for Brighton)' },
              { term: 'Darwin', definition: 'National Rail\'s real-time information system that provides live train running data' },
              { term: 'Push Port', definition: 'A live data feed from Darwin that pushes schedule and status updates via streaming messages' },
              { term: 'TIPLOC', definition: 'Timing Point Location — internal codes used for stations and junctions in rail timetables' },
              { term: 'GTR', definition: 'Govia Thameslink Railway — the operator running Southern, Thameslink, Gatwick Express, and Great Northern' },
              { term: 'BODS', definition: 'Bus Open Data Service — the DfT platform providing open bus timetable and real-time data' },
            ].map(({ term, definition }) => (
              <div key={term} className="rounded-lg border p-3">
                <Badge variant="secondary" className="text-xs mb-1">{term}</Badge>
                <p className="text-xs text-muted-foreground">{definition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Train Status Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-amber-500" />
            Train Status Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { status: 'On Time', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', note: 'Expected to depart within 1 minute of scheduled time' },
              { status: 'Delayed', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', note: 'Running behind schedule — expected time shown where available' },
              { status: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', note: 'Service will not run — check for alternative routes' },
              { status: 'No Report', color: 'bg-muted text-foreground', note: 'No real-time information available yet for this service' },
            ].map(({ status, color, note }) => (
              <div key={status} className="flex items-center gap-3 rounded-lg border p-3">
                <Badge className={color}>{status}</Badge>
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
              { label: 'National Rail Enquiries', url: 'https://www.nationalrail.co.uk/' },
              { label: 'Southern Railway', url: 'https://www.southernrailway.com/' },
              { label: 'Thameslink', url: 'https://www.thameslinkrailway.com/' },
              { label: 'Brighton & Hove Buses', url: 'https://www.buses.co.uk/' },
              { label: 'Trainline', url: 'https://www.thetrainline.com/' },
              { label: 'Delay Repay Compensation', url: 'https://www.southernrailway.com/help-and-contact/delay-repay' },
              { label: 'Transport for the South East', url: 'https://transportforthesoutheast.org.uk/' },
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
    </div>
  );
}
