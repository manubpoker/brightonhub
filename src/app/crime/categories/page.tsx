'use client';

import { useCrime } from '@/lib/hooks/use-crime';
import { ErrorState } from '@/components/shared/error-state';
import { CrimeCategoryChart } from '@/components/crime/crime-category-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function CrimeCategoriesPage() {
  const { data, isLoading, isError } = useCrime();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Crime Categories</h1>
        <ErrorState message="Unable to load crime data. Please try again later." />
      </div>
    );
  }

  const categories = data?.summary.categories ?? [];
  const outcomes = data?.summary.outcomeBreakdown ?? [];
  const total = data?.summary.totalCrimes ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Crime Categories</h1>
        <p className="text-gray-500 mt-1">
          Breakdown by type and outcome for {data?.summary.month ?? 'the latest month'} across BN1-BN3
        </p>
      </div>

      {/* Bar chart */}
      <CrimeCategoryChart data={categories} loading={isLoading} />

      {/* Category table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500 py-4 text-center">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">No category data available.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => {
                const percentage = total > 0 ? ((cat.count / total) * 100).toFixed(1) : '0';
                return (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="text-sm font-medium">{cat.category}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${Math.min(100, parseFloat(percentage))}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="text-xs min-w-[60px] justify-center">
                        {cat.count} ({percentage}%)
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outcome breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500 py-4 text-center">Loading...</p>
          ) : outcomes.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">No outcome data available.</p>
          ) : (
            <div className="space-y-2">
              {outcomes.map((out) => {
                const percentage = total > 0 ? ((out.count / total) * 100).toFixed(1) : '0';
                return (
                  <div
                    key={out.outcome}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="text-sm font-medium">{out.outcome}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div
                          className={cn('h-2 rounded-full bg-amber-500')}
                          style={{ width: `${Math.min(100, parseFloat(percentage))}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="text-xs min-w-[60px] justify-center">
                        {out.count} ({percentage}%)
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Categories are defined by the Home Office and standardised across all police forces.
            Outcome data shows how each reported crime was resolved. Data from{' '}
            <a
              href="https://data.police.uk/"
              className="underline hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Police.uk
            </a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
