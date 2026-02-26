import { NextResponse } from 'next/server';
import { POLICE_API_URL, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';
import { transformNeighbourhoodResponse } from '@/lib/transformers/crime';

export async function GET() {
  try {
    // First, locate the neighbourhood for Brighton coordinates
    const locateRes = await fetch(
      `${POLICE_API_URL}/locate-neighbourhood?q=${BRIGHTON_LAT},${BRIGHTON_LNG}`,
      { next: { revalidate: 86400 }, signal: AbortSignal.timeout(10000) }
    );

    if (!locateRes.ok) {
      throw new Error(`Locate neighbourhood returned ${locateRes.status}`);
    }

    const { force, neighbourhood: nhId } = await locateRes.json();

    // Fetch neighbourhood detail and team in parallel
    const [detailRes, teamRes] = await Promise.all([
      fetch(`${POLICE_API_URL}/${force}/${nhId}`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(10000) }),
      fetch(`${POLICE_API_URL}/${force}/${nhId}/people`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(10000) }),
    ]);

    if (!detailRes.ok) {
      throw new Error(`Neighbourhood detail returned ${detailRes.status}`);
    }

    const detail = await detailRes.json();
    const officers = teamRes.ok ? await teamRes.json() : [];

    const transformed = transformNeighbourhoodResponse(detail, officers);

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Neighbourhood API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch neighbourhood data' },
      { status: 502 }
    );
  }
}
