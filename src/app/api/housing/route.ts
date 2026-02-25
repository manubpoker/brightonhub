import { NextResponse } from 'next/server';
import { LAND_REGISTRY_API_URL } from '@/lib/constants';
import { transformHousingResponse } from '@/lib/transformers/housing';

export const dynamic = 'force-dynamic';

const SPARQL_QUERY = `
PREFIX ukhpi: <http://landregistry.data.gov.uk/def/ukhpi/>
SELECT ?period ?averagePrice ?annualChange
WHERE {
  ?data ukhpi:refRegion <http://landregistry.data.gov.uk/id/region/brighton-and-hove> ;
        ukhpi:refPeriodStart ?period ;
        ukhpi:averagePrice ?averagePrice ;
        ukhpi:percentageAnnualChange ?annualChange .
}
ORDER BY DESC(?period)
LIMIT 12
`.trim();

export async function GET() {
  try {
    const res = await fetch(LAND_REGISTRY_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/sparql-results+json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `query=${encodeURIComponent(SPARQL_QUERY)}`,
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error('Land Registry API returned', res.status);
      return NextResponse.json(
        { error: 'Failed to fetch housing data' },
        { status: 502 }
      );
    }

    const raw = await res.json();
    const transformed = transformHousingResponse(raw);
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Housing API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch housing data' },
      { status: 502 }
    );
  }
}
