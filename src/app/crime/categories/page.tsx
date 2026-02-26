'use client';

import { useCrime } from '@/lib/hooks/use-crime';
import { ErrorState } from '@/components/shared/error-state';
import { CrimeCategoryChart } from '@/components/crime/crime-category-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

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
      <Breadcrumbs items={[{ label: 'Crime & Safety', href: '/crime' }, { label: 'Categories' }]} />
      <div>
        <h1 className="text-2xl font-bold">Crime Categories</h1>
        <p className="text-muted-foreground mt-1">
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
            <p className="text-muted-foreground py-4 text-center">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">No category data available.</p>
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
                      <div className="w-24 bg-muted rounded-full h-2">
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
            <p className="text-muted-foreground py-4 text-center">Loading...</p>
          ) : outcomes.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">No outcome data available.</p>
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
                      <div className="w-24 bg-muted rounded-full h-2">
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
              { term: 'Home Office Categories', definition: 'Standardised crime types used by all police forces in England & Wales for consistent reporting' },
              { term: 'ASB', definition: 'Anti-social behaviour — covers nuisance, environmental damage, and personal harassment' },
              { term: 'Shoplifting', definition: 'Theft from a shop or stall — reported separately from other theft categories' },
              { term: 'Outcome', definition: 'The resolution status of a crime — ranges from "under investigation" to "charged" or "no suspect identified"' },
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
              { label: 'Police.uk Data Downloads', url: 'https://data.police.uk/data/' },
              { label: 'Home Office Crime Statistics', url: 'https://www.gov.uk/government/collections/crime-statistics' },
              { label: 'ONS Crime in England & Wales', url: 'https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice' },
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
            Categories are defined by the Home Office and standardised across all police forces.
            Outcome data shows how each reported crime was resolved. Data from{' '}
            <a
              href="https://data.police.uk/"
              className="underline hover:text-foreground"
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
