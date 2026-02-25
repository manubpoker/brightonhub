'use client';

import { useHousing } from '@/lib/hooks/use-housing';
import { ErrorState } from '@/components/shared/error-state';
import { HousingStats } from '@/components/housing/housing-stats';
import { PriceHistory } from '@/components/housing/price-history';
import { Card, CardContent } from '@/components/ui/card';

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
        <p className="text-gray-500 mt-1">
          Property prices and market trends for Brighton & Hove
        </p>
      </div>

      <HousingStats data={data} isLoading={isLoading} />

      {data && data.history.length > 0 && (
        <PriceHistory history={data.history} />
      )}

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Housing data is sourced from{' '}
            <a
              href="https://landregistry.data.gov.uk/"
              className="underline hover:text-gray-700"
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
