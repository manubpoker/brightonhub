'use client';

import { useState } from 'react';
import { usePlanning } from '@/lib/hooks/use-planning';
import { ErrorState } from '@/components/shared/error-state';
import { ApplicationCard } from '@/components/planning/application-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function ApplicationsPage() {
  const { data, isLoading, isError } = usePlanning();
  const [searchTerm, setSearchTerm] = useState('');

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Planning Applications</h1>
        <ErrorState message="Unable to load planning data. Please try again later." />
      </div>
    );
  }

  const applications = data?.recentApplications ?? [];
  const filtered = searchTerm
    ? applications.filter(
        (app) =>
          app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.reference.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : applications;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Planning', href: '/planning' }, { label: 'Applications' }]} />
      <div>
        <h1 className="text-2xl font-bold">Planning Applications</h1>
        <p className="text-muted-foreground mt-1">
          Searchable list of recent planning applications in Brighton & Hove
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search by description, address, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search planning applications"
              className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isLoading
              ? 'Loading...'
              : `${filtered.length} application${filtered.length !== 1 ? 's' : ''}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              {searchTerm ? 'No applications match your search.' : 'No applications found.'}
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
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
              { label: 'Brighton & Hove Planning Portal', url: 'https://planningapps.brighton-hove.gov.uk/online-applications/' },
              { label: 'How to Comment on Applications', url: 'https://www.brighton-hove.gov.uk/content/planning/planning-applications/comment-planning-application' },
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
    </div>
  );
}
