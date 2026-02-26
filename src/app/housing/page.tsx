'use client';

import { useHousing } from '@/lib/hooks/use-housing';
import { ErrorState } from '@/components/shared/error-state';
import { HousingStats } from '@/components/housing/housing-stats';
import { PriceHistory } from '@/components/housing/price-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, BookOpen, ExternalLink } from 'lucide-react';

export default function HousingPage() {
  const { data, isLoading, isError } = useHousing();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Housing & Property</h1>
        <ErrorState message="Unable to load housing data. Please try again later." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Housing & Property</h1>
        <p className="text-muted-foreground mt-1">
          Property prices and market trends for Brighton & Hove
        </p>
      </div>

      <HousingStats data={data} isLoading={isLoading} />

      {data && data.history.length > 0 && (
        <PriceHistory history={data.history} />
      )}

      {/* Understanding Brighton's Housing Market */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Brighton&apos;s Housing Market
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton &amp; Hove is one of the most expensive cities outside London, with average property
            prices consistently above the national average. The market is driven by strong demand from
            London commuters, the university population, and the city&apos;s cultural appeal.
          </p>
          <p>
            The <strong>UK House Price Index (UK HPI)</strong> tracks property sales registered with
            HM Land Registry. Data is typically 2–3 months behind due to the time between sale completion
            and registration. Seasonal patterns are common — spring and autumn tend to see more activity.
          </p>
          <p>
            The index covers all residential property sales, including cash purchases and new-builds,
            giving a comprehensive picture of the local market.
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
              { term: 'UK HPI', definition: 'UK House Price Index — the official government measure of residential property price changes' },
              { term: 'Average Price', definition: 'The mean sale price for all residential properties in the local authority area' },
              { term: 'Annual Change', definition: 'Year-on-year percentage change comparing the same month to 12 months prior' },
              { term: 'Land Registry', definition: 'HM Land Registry — the government body that registers property ownership in England and Wales' },
              { term: 'SDLT', definition: 'Stamp Duty Land Tax — a tax paid when purchasing property over a threshold (currently £250k, £425k for first-time buyers)' },
            ].map(({ term, definition }) => (
              <div key={term} className="rounded-lg border p-3">
                <Badge variant="secondary" className="text-xs mb-1">{term}</Badge>
                <p className="text-xs text-muted-foreground">{definition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Band Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-amber-500" />
            Price Band Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { band: 'Under £250k', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', note: 'Flats and studios, typically further from the centre' },
              { band: '£250k – £400k', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', note: 'One and two-bed flats in central Brighton and Hove' },
              { band: '£400k – £600k', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', note: 'Larger flats, terraced houses, and suburban properties' },
              { band: 'Over £600k', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', note: 'Detached homes, period properties, and seafront locations' },
            ].map(({ band, color, note }) => (
              <div key={band} className="flex items-center gap-3 rounded-lg border p-3">
                <Badge className={color}>{band}</Badge>
                <span className="text-sm text-muted-foreground">{note}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70 mt-3">
            Price bands are approximate and based on recent Brighton &amp; Hove market data. Actual prices vary by location and condition.
          </p>
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
              { label: 'HM Land Registry', url: 'https://www.gov.uk/government/organisations/land-registry' },
              { label: 'UK House Price Index', url: 'https://www.gov.uk/government/collections/uk-house-price-index-reports' },
              { label: 'Brighton & Hove Council Housing', url: 'https://www.brighton-hove.gov.uk/housing' },
              { label: 'Shelter — Housing Advice', url: 'https://www.shelter.org.uk/' },
              { label: 'Citizens Advice — Housing', url: 'https://www.citizensadvice.org.uk/housing/' },
              { label: 'Rightmove — Brighton', url: 'https://www.rightmove.co.uk/house-prices/Brighton.html' },
              { label: 'Homelessness Support', url: 'https://www.brighton-hove.gov.uk/housing/homelessness' },
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
            Housing data is sourced from{' '}
            <a
              href="https://landregistry.data.gov.uk/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              HM Land Registry Open Data
            </a>{' '}
            using the UK House Price Index. Data covers the Brighton and Hove local authority area
            and is typically 2-3 months behind.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
