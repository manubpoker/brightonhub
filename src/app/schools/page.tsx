'use client';

import { useSchools } from '@/lib/hooks/use-schools';
import { ErrorState } from '@/components/shared/error-state';
import { SchoolsSummary } from '@/components/schools/schools-summary';
import { SchoolList } from '@/components/schools/school-list';
import { SchoolsMap } from '@/components/schools/schools-map';
import { Card, CardContent } from '@/components/ui/card';

export default function SchoolsPage() {
  const { data, isLoading, isError } = useSchools();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Schools & Education</h1>
        <ErrorState message="Unable to load schools data. Please try again later." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Schools & Education</h1>
        <p className="text-gray-500 mt-1">
          Schools and educational facilities across Brighton & Hove
        </p>
      </div>

      <SchoolsSummary data={data} isLoading={isLoading} />

      {data && data.schools.length > 0 && (
        <SchoolsMap
          schools={data.schools}
          className="h-[400px] lg:h-[500px] rounded-lg overflow-hidden border"
        />
      )}

      {data && data.schools.length > 0 && (
        <SchoolList schools={data.schools} />
      )}

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            School data is sourced from{' '}
            <a
              href="https://www.openstreetmap.org/"
              className="underline hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStreetMap
            </a>{' '}
            via the Overpass API. Coverage spans the Brighton & Hove urban area including
            Shoreham and surrounding areas. Data depends on community contributions and may
            not include all schools.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
