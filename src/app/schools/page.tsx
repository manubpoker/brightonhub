'use client';

import { useSchools } from '@/lib/hooks/use-schools';
import { ErrorState } from '@/components/shared/error-state';
import { SchoolsSummary } from '@/components/schools/schools-summary';
import { SchoolList } from '@/components/schools/school-list';
import { SchoolsMap } from '@/components/schools/schools-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, BookOpen, ExternalLink } from 'lucide-react';

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
        <p className="text-muted-foreground mt-1">
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

      {/* Understanding Schools in Brighton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Schools in Brighton &amp; Hove
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton &amp; Hove City Council is the <strong>Local Education Authority (LEA)</strong> responsible
            for school admissions, SEND provision, and education welfare. The city operates a comprehensive
            system with no grammar schools.
          </p>
          <p>
            Secondary school admissions use a <strong>lottery-based system</strong> (random allocation within
            catchment areas) rather than proximity alone — one of the few areas in England to do so. This aims
            to improve social mixing across schools.
          </p>
          <p>
            Schools are inspected by <strong>Ofsted</strong> and rated Outstanding, Good, Requires Improvement,
            or Inadequate. Academies and free schools are funded by central government but operate independently
            of the council.
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
              { term: 'LEA', definition: 'Local Education Authority — the council department responsible for state school provision and admissions' },
              { term: 'Ofsted', definition: 'Office for Standards in Education — inspects and rates schools, childcare, and children\'s services' },
              { term: 'Academy', definition: 'A state-funded school run by an academy trust independent of the local council' },
              { term: 'Free School', definition: 'A type of academy set up by parents, teachers, charities, or businesses — funded by government' },
              { term: 'SEND', definition: 'Special Educational Needs and Disabilities — additional support for children who need it' },
              { term: 'Key Stage', definition: 'Age-related stages of the national curriculum: KS1 (5–7), KS2 (7–11), KS3 (11–14), KS4 (14–16)' },
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
              { label: 'Council Education Services', url: 'https://www.brighton-hove.gov.uk/children-and-education' },
              { label: 'School Admissions', url: 'https://www.brighton-hove.gov.uk/schools-and-learning/school-admissions' },
              { label: 'Ofsted Reports', url: 'https://reports.ofsted.gov.uk/' },
              { label: 'DfE School Performance', url: 'https://www.find-school-performance-data.service.gov.uk/' },
              { label: 'SEND Local Offer', url: 'https://www.brighton-hove.gov.uk/special-educational-needs-and-disability-send' },
              { label: 'Get Information About Schools', url: 'https://get-information-schools.service.gov.uk/' },
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
            School data is sourced from{' '}
            <a
              href="https://www.openstreetmap.org/"
              className="underline hover:text-foreground"
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
