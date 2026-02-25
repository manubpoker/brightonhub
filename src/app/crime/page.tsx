'use client';

import { useState } from 'react';
import { useCrime } from '@/lib/hooks/use-crime';
import { StatusCard } from '@/components/shared/status-card';
import { ErrorState } from '@/components/shared/error-state';
import { CrimeMap } from '@/components/crime/crime-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, MapPin, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const AREA_COLORS: Record<string, string> = {
  BN1: 'bg-red-100 text-red-700',
  BN2: 'bg-orange-100 text-orange-700',
  BN3: 'bg-purple-100 text-purple-700',
  BN41: 'bg-cyan-100 text-cyan-700',
  BN42: 'bg-fuchsia-100 text-fuchsia-700',
  BN43: 'bg-lime-100 text-lime-700',
};

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
      <div>
        <h1 className="text-2xl font-bold">Crime & Safety</h1>
        <p className="text-gray-500 mt-1">
          Monthly crime data across Brighton & Hove urban area from Police.uk open data
        </p>
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
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                    selectedArea === area.area && 'ring-2 ring-gray-900'
                  )}
                  onClick={() => setSelectedArea(selectedArea === area.area ? null : area.area)}
                >
                  <div className="flex items-center justify-between">
                    <Badge className={AREA_COLORS[area.area] ?? 'bg-gray-100 text-gray-700'}>
                      {area.area}
                    </Badge>
                    <span className="text-lg font-bold">{area.count}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{area.label}</p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-1.5 bg-gray-600 rounded-full"
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
                <p className="text-xs text-gray-500">Charts and tables by crime type</p>
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
                <p className="text-xs text-gray-500">Local team and contact info</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Crime data is provided by{' '}
            <a
              href="https://data.police.uk/"
              className="underline hover:text-gray-700"
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
