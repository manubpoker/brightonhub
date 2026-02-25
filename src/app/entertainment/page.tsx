'use client';

import { useEntertainment } from '@/lib/hooks/use-entertainment';
import { ErrorState } from '@/components/shared/error-state';
import { EntertainmentSummary } from '@/components/entertainment/entertainment-summary';
import { EventCalendar } from '@/components/entertainment/event-calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket } from 'lucide-react';

export default function EntertainmentPage() {
  const { data, isLoading, isError, error } = useEntertainment();

  // Check for API key not configured (503 from our route)
  const isNotConfigured = isError && error?.message?.includes('Failed to fetch');

  if (isError && !isNotConfigured) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Entertainment</h1>
        <ErrorState message="Unable to load entertainment data. Please try again later." />
      </div>
    );
  }

  const hasEvents = data && data.events.length > 0;
  const noApiKey = !isLoading && !data && isError;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Entertainment</h1>
        <p className="text-gray-500 mt-1">
          Concerts, shows, theatre, comedy, exhibitions, and events in Brighton & Hove
        </p>
      </div>

      {noApiKey ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Ticket className="h-14 w-14 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-600">API Key Required</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              Entertainment data requires a free Skiddle API key. Apply at{' '}
              <a
                href="https://www.skiddle.com/api/join.php"
                className="text-rose-600 underline hover:text-rose-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                skiddle.com/api
              </a>{' '}
              then add <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">SKIDDLE_API_KEY=your_key</code> to{' '}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code>.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <EntertainmentSummary data={data} isLoading={isLoading} />
          {hasEvents && <EventCalendar events={data.events} />}
          {!isLoading && data && data.events.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center">
                <Ticket className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-600">No Upcoming Events</h2>
                <p className="text-gray-500 mt-2">
                  No events found within 10 miles of Brighton in the next 14 days.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Event listings are sourced from{' '}
            <a
              href="https://www.skiddle.com/"
              className="underline hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Skiddle
            </a>
            , a UK events platform. Data covers events within 10 miles of Brighton for the
            next 14 days. Listings depend on promoter participation and may not include all events.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
