import { NextResponse } from 'next/server';
import { GIVEFOOD_API_URL, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';
import { transformCommunityResponse } from '@/lib/transformers/community';

export async function GET() {
  try {
    const url = `${GIVEFOOD_API_URL}?lat_lng=${BRIGHTON_LAT},${BRIGHTON_LNG}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error('GiveFood API returned', res.status);
      return NextResponse.json(
        { error: 'Failed to fetch community data' },
        { status: 502 }
      );
    }

    const raw = await res.json();
    const transformed = transformCommunityResponse(raw);
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Community API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community data' },
      { status: 502 }
    );
  }
}
