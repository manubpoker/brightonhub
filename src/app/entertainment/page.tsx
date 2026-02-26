'use client';

import { useEntertainment } from '@/lib/hooks/use-entertainment';
import { ErrorState } from '@/components/shared/error-state';
import { EntertainmentSummary } from '@/components/entertainment/entertainment-summary';
import { EventCalendar } from '@/components/entertainment/event-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Info, ExternalLink } from 'lucide-react';

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
        <p className="text-muted-foreground mt-1">
          Concerts, shows, theatre, comedy, exhibitions, and events in Brighton & Hove
        </p>
      </div>

      {noApiKey ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Ticket className="h-14 w-14 text-muted-foreground/70 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-muted-foreground">API Key Required</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Entertainment data requires a free Skiddle API key. Apply at{' '}
              <a
                href="https://www.skiddle.com/api/join.php"
                className="text-rose-600 underline hover:text-rose-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                skiddle.com/api
              </a>{' '}
              then add <code className="text-xs bg-muted px-1 py-0.5 rounded">SKIDDLE_API_KEY=your_key</code> to{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">.env.local</code>.
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
                <Ticket className="h-14 w-14 text-muted-foreground/70 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-muted-foreground">No Upcoming Events</h2>
                <p className="text-muted-foreground mt-2">
                  No events found within 10 miles of Brighton in the next 14 days.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Brighton's Entertainment Scene */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Brighton&apos;s Entertainment Scene
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton is one of the UK&apos;s top cultural destinations, famous for the{' '}
            <strong>Brighton Festival</strong> (England&apos;s largest mixed-arts festival, every May) and the{' '}
            <strong>Brighton Fringe</strong> (the third-largest fringe festival in the world).
          </p>
          <p>
            The city has a thriving live venue scene, from the <strong>Brighton Dome</strong> (a 2,000-seat
            concert hall in the Royal Pavilion estate) and the <strong>Brighton Centre</strong> (the
            city&apos;s largest arena) to intimate spaces like Komedia, The Old Market, and the Green Door
            Store.
          </p>
          <p>
            <strong>Theatre Royal Brighton</strong>, built in 1807, hosts West End touring productions,
            while Duke of York&apos;s Picturehouse (the oldest continually operating cinema in the UK)
            screens independent and art-house films year-round.
          </p>
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
              { label: 'Visit Brighton', url: 'https://www.visitbrighton.com/' },
              { label: 'Brighton Festival', url: 'https://brightonfestival.org/' },
              { label: 'Brighton Fringe', url: 'https://www.brightonfringe.org/' },
              { label: 'Brighton Dome', url: 'https://brightondome.org/' },
              { label: 'Theatre Royal Brighton', url: 'https://www.atgtickets.com/venues/theatre-royal-brighton/' },
              { label: 'Brighton Centre', url: 'https://brightoncentre.co.uk/' },
              { label: 'Skiddle — Brighton Events', url: 'https://www.skiddle.com/whats-on/Brighton/' },
              { label: 'Komedia Brighton', url: 'https://www.komedia.co.uk/brighton/' },
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

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            Event listings are sourced from{' '}
            <a
              href="https://www.skiddle.com/"
              className="underline hover:text-foreground"
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
