import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Info, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function BusesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Transport', href: '/transport' }, { label: 'Bus Services' }]} />
      <div>
        <h1 className="text-2xl font-bold">Bus Services</h1>
        <p className="text-muted-foreground mt-1">
          Real-time bus service information for Brighton & Hove
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Bus className="h-16 w-16 text-muted-foreground/70 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-muted-foreground">Coming Soon</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Bus service data integration is planned for a future update.
            This will include real-time arrivals and service disruption information
            via the Bus Open Data Service (BODS).
          </p>
        </CardContent>
      </Card>

      {/* Understanding Buses in Brighton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Bus Services in Brighton &amp; Hove
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Brighton &amp; Hove Buses</strong> is the main operator, running most routes across
            the city and surrounding areas. <strong>Compass Travel</strong> and <strong>Stagecoach</strong>{' '}
            cover some rural and inter-town routes.
          </p>
          <p>
            Key routes include the <strong>1/1A</strong> (Whitehawk to Mile Oak via city centre),{' '}
            <strong>5/5A</strong> (Hangleton to East Brighton), <strong>7</strong> (Marina to Portslade),
            and <strong>25</strong> (Portslade to University of Sussex). The <strong>700 Coastliner</strong>{' '}
            connects Brighton to Portsmouth along the coast.
          </p>
          <p>
            Night buses (<strong>N5, N7, N25</strong>) run on Friday and Saturday nights. Student Saver
            passes offer unlimited bus travel at discounted rates for university students.
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
              { label: 'Brighton & Hove Buses', url: 'https://www.buses.co.uk/' },
              { label: 'Live Bus Map', url: 'https://www.buses.co.uk/map' },
              { label: 'Timetables & Routes', url: 'https://www.buses.co.uk/routes-and-maps' },
              { label: 'Student Saver Pass', url: 'https://www.buses.co.uk/student-saver' },
              { label: 'Bus Open Data Service', url: 'https://data.bus-data.dft.gov.uk/' },
              { label: 'Compass Travel', url: 'https://www.compass-travel.co.uk/' },
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
