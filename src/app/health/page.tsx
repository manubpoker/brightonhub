'use client';

import { useHealth } from '@/lib/hooks/use-health';
import { ErrorState } from '@/components/shared/error-state';
import { HealthSummary } from '@/components/health/health-summary';
import { FacilityList } from '@/components/health/facility-list';
import { HealthMap } from '@/components/health/health-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, BookOpen, ExternalLink } from 'lucide-react';

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
        <p className="text-muted-foreground mt-1">
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

      {/* Understanding Health Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Health Services in Brighton
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton &amp; Hove falls under the <strong>NHS Sussex Integrated Care Board (ICB)</strong>, which
            coordinates health services across Sussex. The city is served by the{' '}
            <strong>Royal Sussex County Hospital</strong> (major trauma centre) on Eastern Road and several
            community hospitals.
          </p>
          <p>
            GP practices are organised into <strong>Primary Care Networks (PCNs)</strong> — clusters of
            practices working together with community services. Most Brighton residents can register with
            any GP practice that covers their area — you don&apos;t need proof of address or immigration status.
          </p>
          <p>
            Community pharmacies offer walk-in services including the NHS <strong>Pharmacy First</strong>{' '}
            scheme, which can treat common conditions like earache, sore throat, and UTIs without a GP
            appointment.
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
              { term: 'GP', definition: 'General Practitioner — your primary NHS doctor for non-emergency care' },
              { term: 'ODS', definition: 'Organisation Data Service — NHS England\'s register of health organisations' },
              { term: 'ICB', definition: 'Integrated Care Board — plans and funds NHS services for a region (replaced CCGs in 2022)' },
              { term: 'PCN', definition: 'Primary Care Network — a group of GP practices working together to serve 30,000–50,000 patients' },
              { term: 'CQC', definition: 'Care Quality Commission — the independent regulator that inspects and rates health services' },
              { term: 'Pharmacy First', definition: 'NHS scheme where pharmacists can assess and treat 7 common conditions without a GP visit' },
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
              { label: 'NHS Find a GP', url: 'https://www.nhs.uk/service-search/find-a-gp' },
              { label: 'NHS 111 Online', url: 'https://111.nhs.uk/' },
              { label: 'NHS Sussex ICB', url: 'https://www.sussex.ics.nhs.uk/' },
              { label: 'Royal Sussex County Hospital', url: 'https://www.uhsussex.nhs.uk/' },
              { label: 'Brighton & Hove Wellbeing', url: 'https://www.brighton-hove.gov.uk/health' },
              { label: 'CQC — Check a Service', url: 'https://www.cqc.org.uk/' },
              { label: 'Council Health & Care', url: 'https://www.brighton-hove.gov.uk/adult-social-care' },
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
            Health facility data is sourced from the{' '}
            <a
              href="https://directory.spineservices.nhs.uk/"
              className="underline hover:text-foreground"
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
