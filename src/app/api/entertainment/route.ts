import { NextResponse } from 'next/server';
import { SKIDDLE_API_URL, SKIDDLE_API_KEY, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';
import { transformEntertainmentResponse } from '@/lib/transformers/entertainment';
import { getUKDateString, getUKDateStringOffset } from '@/lib/date-utils';

export async function GET() {
  if (!SKIDDLE_API_KEY) {
    return NextResponse.json(
      { error: 'Skiddle API key not configured. Add SKIDDLE_API_KEY to .env.local' },
      { status: 503 }
    );
  }

  try {
    const today = getUKDateString();
    // Fetch events for the next 14 days
    const maxDate = getUKDateStringOffset(14);

    const params = new URLSearchParams({
      api_key: SKIDDLE_API_KEY,
      latitude: String(BRIGHTON_LAT),
      longitude: String(BRIGHTON_LNG),
      radius: '10',
      minDate: today,
      maxDate: maxDate,
      limit: '100',
      order: 'date',
      description: '1',
    });

    const res = await fetch(`${SKIDDLE_API_URL}?${params}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error('Skiddle API returned', res.status);
      return NextResponse.json(
        { error: 'Failed to fetch entertainment data' },
        { status: 502 }
      );
    }

    const data = await res.json();
    const events = data.results ?? data;
    const transformed = transformEntertainmentResponse(Array.isArray(events) ? events : []);
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Entertainment API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entertainment data' },
      { status: 502 }
    );
  }
}
