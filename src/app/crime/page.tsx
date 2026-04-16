'use client';

import { useState } from 'react';
import { useCrime } from '@/lib/hooks/use-crime';
import { StatusCard } from '@/components/shared/status-card';
import { ErrorState } from '@/components/shared/error-state';
import { RefreshButton } from '@/components/shared/refresh-button';
import { CrimeMap } from '@/components/crime/crime-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, MapPin, BarChart3, Info, BookOpen, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CRIME_AREA_COLORS } from '@/lib/constants';
import Link from 'next/link';

export default function CrimePage() {
  const { data, isLoading, isError } = useCrime();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Crime & Safety</h1>
        <ErrorState message="Unable to load crime data. Please try again later." />
      </div>
    );
  }

  const summary = data?.summary;
  const allIncidents = data?.incidents ?? [];
  const incidents = selectedArea
    ? allIncidents.filter((i) => i.area === selectedArea)
    : allIncidents;
  const topCategory = summary?.categories[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Crime &amp; Safety</h1>
          <p className="text-muted-foreground mt-1">
            Monthly crime data across Brighton &amp; Hove urban area from Police.uk open data
          </p>
        </div>
        <RefreshButton className="mt-1" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          title="Monthly Total"
          icon={Shield}
          severity={summary?.severity ?? 'normal'}
          value={summary ? `${summary.totalCrimes}` : '...'}
          subtitle={summary ? `Month: ${summary.month} across Brighton & Hove` : 'Loading...'}
          loading={isLoading}
        />
        <StatusCard
          title="Top Category"
          icon={TrendingUp}
          severity="normal"
          value={topCategory?.category ?? 'N/A'}
          subtitle={topCategory ? `${topCategory.count} incidents` : ''}
          loading={isLoading}
        />
        <StatusCard
          title="Locations"
          icon={MapPin}
          severity="normal"
          value={isLoading ? '...' : `${allIncidents.length}`}
          subtitle="Reported incident locations"
          loading={isLoading}
        />
      </div>

      {/* Area breakdown */}
      {summary?.areaBreakdown && summary.areaBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Area Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedArea(null)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  selectedArea === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                )}
              >
                All Areas ({summary.totalCrimes})
              </button>
              {summary.areaBreakdown.map((area) => (
                <button
                  key={area.area}
                  onClick={() => setSelectedArea(selectedArea === area.area ? null : area.area)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    selectedArea === area.area
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  )}
                >
                  {area.area} ({area.count})
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {summary.areaBreakdown.map((area) => (
                <div
                  key={area.area}
                  className={cn(
                    'rounded-lg border p-4 cursor-pointer transition-shadow hover:shadow-sm',
                    selectedArea === area.area && 'ring-2 ring-primary'
                  )}
                  onClick={() => setSelectedArea(selectedArea === area.area ? null : area.area)}
                >
                  <div className="flex items-center justify-between">
                    <Badge className={CRIME_AREA_COLORS[area.area] ?? 'bg-muted text-foreground'}>
                      {area.area}
                    </Badge>
                    <span className="text-lg font-bold">{area.count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{area.label}</p>
                  <div className="mt-2 h-1.5 bg-muted rounded-full">
                    <div
                      className="h-1.5 bg-primary rounded-full"
                      style={{
                        width: `${Math.min(100, (area.count / Math.max(...summary.areaBreakdown.map((a) => a.count))) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map */}
      {incidents.length > 0 && (
        <CrimeMap
          incidents={incidents}
          className="h-[400px] lg:h-[500px] rounded-lg overflow-hidden border"
        />
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/crime/categories">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Category Breakdown</p>
                <p className="text-xs text-muted-foreground">Charts and tables by crime type</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/crime/neighbourhood">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Neighbourhood Policing</p>
                <p className="text-xs text-muted-foreground">Local team and contact info</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Understanding Crime Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Crime Data in Brighton
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Crime data covers the Brighton &amp; Hove urban area across six postcode districts.{' '}
            <strong>BN1</strong> (Central Brighton, including the city centre and nightlife areas)
            consistently reports the highest volumes due to population density and foot traffic.
          </p>
          <p>
            Data is typically <strong>2 months behind</strong> the current date due to processing time.
            Seasonal patterns are common — summer months and the festival season tend to see increased
            reports, particularly for ASB and violent crime.
          </p>
          <p>
            Location coordinates are <strong>anonymised</strong> by Police.uk to the nearest street or
            landmark (snap points), so pins on the map represent approximate areas rather than exact
            addresses. Some incidents are mapped to the same point if they occurred on the same street.
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
              { term: 'Police.uk', definition: 'The open data platform providing street-level crime data for England, Wales, and Northern Ireland' },
              { term: 'OGL', definition: 'Open Government Licence — allows free reuse of government data with attribution' },
              { term: 'ASB', definition: 'Anti-social behaviour — includes nuisance, environmental, and personal categories' },
              { term: 'Violent Crime', definition: 'Offences including assault, harassment, and public order — the broadest Home Office category' },
              { term: 'Outcome', definition: 'How a reported crime was resolved — e.g. investigation complete, unable to prosecute, charged' },
              { term: 'BN Areas', definition: 'BN1 (Central), BN2 (East/Kemptown), BN3 (Hove), BN41 (Southwick), BN42–43 (Shoreham)' },
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
              { label: 'Police.uk — Brighton', url: 'https://www.police.uk/pu/your-area/sussex-police/' },
              { label: 'Sussex Police', url: 'https://www.sussex.police.uk/' },
              { label: 'Report a Crime', url: 'https://www.sussex.police.uk/ro/report/ocr/af/how-to-report-a-crime/' },
              { label: 'Crimestoppers', url: 'https://crimestoppers-uk.org/' },
              { label: 'Victim Support', url: 'https://www.victimsupport.org.uk/' },
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
            Crime data is provided by{' '}
            <a
              href="https://data.police.uk/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Police.uk
            </a>{' '}
            under the Open Government Licence. Data covers the Brighton & Hove urban area: BN1 (Central),
            BN2 (East Brighton & Kemptown), BN3 (Hove), BN41 (Southwick), BN42-BN43 (Shoreham).
            Data is typically 2 months behind. Location coordinates are anonymised to the nearest street.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
