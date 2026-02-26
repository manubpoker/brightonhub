'use client';

import { usePlanning } from '@/lib/hooks/use-planning';
import { StatusCard } from '@/components/shared/status-card';
import { ErrorState } from '@/components/shared/error-state';
import { PlanningMap } from '@/components/planning/planning-map';
import { ApplicationCard } from '@/components/planning/application-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Landmark, FileText, MapPin, ExternalLink, Info, BookOpen } from 'lucide-react';
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
        <p className="text-muted-foreground mt-1">
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
            <Landmark className="h-14 w-14 text-muted-foreground/70 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-muted-foreground">No Data Available Yet</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
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

      {/* Understanding Planning in Brighton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Planning in Brighton &amp; Hove
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton &amp; Hove has <strong>34 conservation areas</strong> and over 3,400 listed buildings,
            making planning decisions particularly complex. The council&apos;s <strong>City Plan</strong>{' '}
            guides development strategy through to 2030.
          </p>
          <p>
            Most applications fall into three types: <strong>full planning permission</strong> (major works),{' '}
            <strong>householder applications</strong> (extensions, alterations), and <strong>listed building
            consent</strong> (changes to heritage assets). Some minor works qualify as{' '}
            <strong>permitted development</strong> and don&apos;t need an application.
          </p>
          <p>
            The national <strong>Planning Data platform</strong> (run by DLUHC) is in beta — not all councils
            have published their data yet. For the most complete local records, the council&apos;s own planning
            portal remains the primary source.
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
              { term: 'DLUHC', definition: 'Department for Levelling Up, Housing and Communities — the government department overseeing planning policy' },
              { term: 'Listed Building', definition: 'A building of special architectural or historic interest — Grade I, II*, or II — with restrictions on alterations' },
              { term: 'Conservation Area', definition: 'An area of special architectural or historic interest where extra planning controls apply' },
              { term: 'CIL', definition: 'Community Infrastructure Levy — a charge on new development to fund local infrastructure like schools and roads' },
              { term: 'S106', definition: 'Section 106 agreement — a legal agreement requiring developers to provide affordable housing or community benefits' },
              { term: 'Permitted Development', definition: 'Building work that can be carried out without planning permission under national rules' },
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
              { label: 'Council Planning Portal', url: 'https://planningapps.brighton-hove.gov.uk/online-applications/' },
              { label: 'National Planning Data (beta)', url: 'https://www.planning.data.gov.uk/' },
              { label: 'Conservation Areas', url: 'https://www.brighton-hove.gov.uk/content/planning/heritage/conservation-areas' },
              { label: 'City Plan', url: 'https://www.brighton-hove.gov.uk/content/planning/planning-policy/city-plan' },
              { label: 'Historic England', url: 'https://historicengland.org.uk/' },
              { label: 'Planning Portal (national)', url: 'https://www.planningportal.co.uk/' },
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
            Planning data is sourced from the{' '}
            <a
              href="https://www.planning.data.gov.uk/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              national Planning Data platform
            </a>{' '}
            (beta, run by DLUHC). Coverage depends on each council&apos;s participation. For
            Brighton & Hove applications, you can also check the{' '}
            <a
              href="https://planningapps.brighton-hove.gov.uk/online-applications/"
              className="underline hover:text-foreground"
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
