import { NextResponse } from 'next/server';
import { POLICE_API_URL, CRIME_AREAS } from '@/lib/constants';
import { transformMultiAreaCrimeResponse } from '@/lib/transformers/crime';

async function fetchCrimesForDate(lat: number, lng: number, date: string) {
  const res = await fetch(
    `${POLICE_API_URL}/crimes-street/all-crime?lat=${lat}&lng=${lng}&date=${date}`,
    { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) }
  );
  return res;
}

export async function GET() {
  try {
    // Police.uk data is ~2 months behind
    const now = new Date();
    now.setMonth(now.getMonth() - 2);
    let date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Try fetching for each area in parallel
    let results = await Promise.all(
      CRIME_AREAS.map(async (area) => {
        const res = await fetchCrimesForDate(area.lat, area.lng, date);
        return { area, res };
      })
    );

    // If any return 422 (date not available), retry only the failed areas
    const failedAreas = results.filter((r) => r.res.status === 422);
    if (failedAreas.length > 0) {
      now.setMonth(now.getMonth() - 1);
      date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const retried = await Promise.all(
        failedAreas.map(async ({ area }) => {
          const res = await fetchCrimesForDate(area.lat, area.lng, date);
          return { area, res };
        })
      );
      // Replace failed results with retried ones
      const retriedMap = new Map(retried.map((r) => [r.area.id, r]));
      results = results.map((r) => retriedMap.get(r.area.id) ?? r);
    }

    // Parse all successful responses
    const areaData = await Promise.all(
      results.map(async ({ area, res }) => {
        if (!res.ok) {
          console.warn(`Crime API returned ${res.status} for ${area.id}`);
          return { area: area.id, label: area.label, crimes: [] as never[] };
        }
        const crimes = await res.json();
        return { area: area.id, label: area.label, crimes };
      })
    );

    const transformed = transformMultiAreaCrimeResponse(areaData);

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Crime API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crime data' },
      { status: 502 }
    );
  }
}
