'use client';

import { usePlanning } from '@/lib/hooks/use-planning';
import { StatusCard } from '@/components/shared/status-card';
import { ErrorState } from '@/components/shared/error-state';
import { PlanningMap } from '@/components/planning/planning-map';
import { ApplicationCard } from '@/components/planning/application-card';
import { Card, CardContent } from '@/components/ui/card';
import { Landmark, FileText, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function PlanningPage() {
  const { data, isLoading, isError } = usePlanning();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Planning & Development</h1>
        <ErrorState message="Unable to load planning data. Please try again later." />
      </div>
    );
  }

  const applications = data?.recentApplications ?? [];
  const withLocation = applications.filter((a) => a.location !== null);
  const isEmpty = !isLoading && applications.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Planning & Development</h1>
        <p className="text-gray-500 mt-1">
          Planning applications in Brighton & Hove
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          title="Total Applications"
          icon={Landmark}
          severity="normal"
          value={isLoading ? '...' : `${data?.totalApplications ?? 0}`}
          subtitle="From national planning data"
          loading={isLoading}
        />
        <StatusCard
          title="With Location"
          icon={MapPin}
          severity="normal"
          value={isLoading ? '...' : `${withLocation.length}`}
          subtitle="Mappable applications"
          loading={isLoading}
        />
        <StatusCard
          title="View All"
          icon={FileText}
          severity="normal"
          value="Full List"
          subtitle="Search and filter applications"
          loading={isLoading}
        />
      </div>

      {/* Empty state — Brighton hasn't published to the national platform yet */}
      {isEmpty && (
        <Card>
          <CardContent className="py-10 text-center">
            <Landmark className="h-14 w-14 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-600">No Data Available Yet</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              Brighton & Hove City Council has not yet published planning application data to the
              national Planning Data platform. This is common — the platform is in beta and councils
              are onboarding gradually.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://planningapps.brighton-hove.gov.uk/online-applications/"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Brighton & Hove Council Planning Portal
              </a>
              <a
                href="https://www.planning.data.gov.uk/"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                National Planning Data (beta)
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map */}
      {withLocation.length > 0 && (
        <PlanningMap
          applications={applications}
          className="h-[400px] lg:h-[500px] rounded-lg overflow-hidden border"
        />
      )}

      {/* Recent applications */}
      {applications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.slice(0, 6).map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
          {applications.length > 6 && (
            <Link
              href="/planning/applications"
              className="block text-center text-sm text-blue-600 hover:underline mt-4"
            >
              View all {data?.totalApplications} applications
            </Link>
          )}
        </div>
      )}

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Planning data is sourced from the{' '}
            <a
              href="https://www.planning.data.gov.uk/"
              className="underline hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              national Planning Data platform
            </a>{' '}
            (beta, run by DLUHC). Coverage depends on each council&apos;s participation. For
            Brighton & Hove applications, you can also check the{' '}
            <a
              href="https://planningapps.brighton-hove.gov.uk/online-applications/"
              className="underline hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              council&apos;s own planning portal
            </a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
