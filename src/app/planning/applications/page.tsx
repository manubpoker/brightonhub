'use client';

import { useState } from 'react';
import { usePlanning } from '@/lib/hooks/use-planning';
import { ErrorState } from '@/components/shared/error-state';
import { ApplicationCard } from '@/components/planning/application-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

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
      <div>
        <h1 className="text-2xl font-bold">Planning Applications</h1>
        <p className="text-gray-500 mt-1">
          Searchable list of recent planning applications in Brighton & Hove
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description, address, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <p className="text-gray-500 py-8 text-center">
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
    </div>
  );
}
