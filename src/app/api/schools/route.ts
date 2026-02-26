import { NextResponse } from 'next/server';
import { OVERPASS_API_URL, BRIGHTON_BBOX } from '@/lib/constants';
import { transformSchoolsResponse } from '@/lib/transformers/schools';

// Brighton & Hove wider urban bounding box (includes Shoreham/Portslade)
const OVERPASS_QUERY = `[out:json];(node[amenity=school](${BRIGHTON_BBOX.south},${BRIGHTON_BBOX.west},${BRIGHTON_BBOX.north},${BRIGHTON_BBOX.east});way[amenity=school](${BRIGHTON_BBOX.south},${BRIGHTON_BBOX.west},${BRIGHTON_BBOX.north},${BRIGHTON_BBOX.east});relation[amenity=school](${BRIGHTON_BBOX.south},${BRIGHTON_BBOX.west},${BRIGHTON_BBOX.north},${BRIGHTON_BBOX.east}););out body center qt;`;

export async function GET() {
  try {
    const res = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(OVERPASS_QUERY)}`,
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error('Overpass API returned', res.status);
      return NextResponse.json(
        { error: 'Failed to fetch schools data' },
        { status: 502 }
      );
    }

    const raw = await res.json();
    const transformed = transformSchoolsResponse(raw);
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Schools API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools data' },
      { status: 502 }
    );
  }
}
