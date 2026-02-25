'use client';

import { useHealth } from '@/lib/hooks/use-health';
import { ErrorState } from '@/components/shared/error-state';
import { HealthSummary } from '@/components/health/health-summary';
import { FacilityList } from '@/components/health/facility-list';
import { HealthMap } from '@/components/health/health-map';
import { Card, CardContent } from '@/components/ui/card';

export default function HealthPage() {
  const { data, isLoading, isError } = useHealth();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Health & NHS</h1>
        <ErrorState message="Unable to load health data. Please try again later." />
      </div>
    );
  }

  const facilitiesWithLocation = data?.facilities.filter((f) => f.location !== null) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Health & NHS</h1>
        <p className="text-gray-500 mt-1">
          GP practices, pharmacies, hospitals, and dentists across Brighton & Hove
        </p>
      </div>

      <HealthSummary data={data} isLoading={isLoading} />

      {facilitiesWithLocation.length > 0 && (
        <HealthMap
          facilities={data!.facilities}
          className="h-[400px] lg:h-[500px] rounded-lg overflow-hidden border"
        />
      )}

      {data && data.facilities.length > 0 && (
        <FacilityList facilities={data.facilities} />
      )}

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Health facility data is sourced from the{' '}
            <a
              href="https://directory.spineservices.nhs.uk/"
              className="underline hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              NHS Organisation Data Service (ODS)
            </a>
            . Data covers active organisations across the Brighton & Hove urban area
            (BN1, BN2, BN3, BN41, BN42, BN43). Locations are approximate (postcode centroid).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
