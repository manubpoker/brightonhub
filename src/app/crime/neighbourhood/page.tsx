'use client';

import { useNeighbourhood } from '@/lib/hooks/use-crime';
import { ErrorState } from '@/components/shared/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div>
        <h1 className="text-2xl font-bold">Neighbourhood Policing</h1>
        <p className="text-gray-500 mt-1">
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
                  className="text-sm text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: info.description }}
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
            <p className="text-gray-500 py-4 text-center">
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
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{officer.bio}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Neighbourhood policing data is provided by{' '}
            <a
              href="https://data.police.uk/"
              className="underline hover:text-gray-700"
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
