'use client';

import { useNeighbourhood } from '@/lib/hooks/use-crime';
import { ErrorState } from '@/components/shared/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, Info, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { sanitizeHtml } from '@/lib/sanitize';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function NeighbourhoodPage() {
  const { data, isLoading, isError } = useNeighbourhood();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Neighbourhood Policing</h1>
        <ErrorState message="Unable to load neighbourhood data. Please try again later." />
      </div>
    );
  }

  const info = data?.info;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Crime & Safety', href: '/crime' }, { label: 'Neighbourhood Policing' }]} />
      <div>
        <h1 className="text-2xl font-bold">Neighbourhood Policing</h1>
        <p className="text-muted-foreground mt-1">
          Local policing team and contact information for the Brighton area
        </p>
      </div>

      {/* Neighbourhood info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              info?.name ?? 'Neighbourhood'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              {info?.description && (
                <div
                  className="text-sm text-muted-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(info.description) }}
                />
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                {info?.contactEmail && (
                  <a
                    href={`mailto:${info.contactEmail}`}
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {info.contactEmail}
                  </a>
                )}
                {info?.contactPhone && (
                  <a
                    href={`tel:${info.contactPhone}`}
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {info.contactPhone}
                  </a>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Team members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Local Policing Team
            {info?.team && (
              <Badge variant="secondary" className="ml-auto">
                {info.team.length} officers
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !info?.team || info.team.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No team information available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {info.team.map((officer, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <p className="font-medium text-sm">{officer.name}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {officer.rank}
                  </Badge>
                  {officer.bio && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{officer.bio}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Understanding Neighbourhood Policing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Neighbourhood Policing
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton &amp; Hove is policed by <strong>Sussex Police</strong>. Neighbourhood policing teams
            are allocated to specific areas and focus on community engagement, local crime prevention, and
            anti-social behaviour.
          </p>
          <p>
            You can report non-emergency crimes online via Sussex Police or by calling <strong>101</strong>.
            In an emergency, always call <strong>999</strong>. For anonymous tip-offs, contact{' '}
            <strong>Crimestoppers</strong> on 0800 555 111.
          </p>
          <p>
            Team compositions change regularly as officers are reassigned. The data shown here comes from
            the Police.uk API and is refreshed daily.
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
              { label: 'Sussex Police', url: 'https://www.sussex.police.uk/' },
              { label: 'Report a Crime Online', url: 'https://www.sussex.police.uk/ro/report/ocr/af/how-to-report-a-crime/' },
              { label: 'Find Your Neighbourhood', url: 'https://www.police.uk/pu/your-area/sussex-police/' },
              { label: 'Crimestoppers', url: 'https://crimestoppers-uk.org/' },
              { label: 'Victim Support', url: 'https://www.victimsupport.org.uk/' },
              { label: 'Police.uk', url: 'https://www.police.uk/' },
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
            Neighbourhood policing data is provided by{' '}
            <a
              href="https://data.police.uk/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Police.uk
            </a>{' '}
            under the Open Government Licence. Team compositions may change; data is refreshed daily.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
