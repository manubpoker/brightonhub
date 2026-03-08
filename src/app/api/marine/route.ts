import { NextResponse } from 'next/server';
import { OPENMETEO_MARINE_API_URL, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';
import { transformMarineResponse } from '@/lib/transformers/marine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const params = new URLSearchParams({
      latitude: String(BRIGHTON_LAT),
      longitude: String(BRIGHTON_LNG),
      current: 'wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period',
      hourly: 'wave_height,wave_direction,wave_period,swell_wave_height',
      daily: 'wave_height_max,wave_direction_dominant,wave_period_max,swell_wave_height_max',
      timezone: 'Europe/London',
      forecast_days: '7',
    });

    const res = await fetch(`${OPENMETEO_MARINE_API_URL}/marine?${params}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo Marine API returned ${res.status}`);
    }

    const data = await res.json();
    const transformed = transformMarineResponse(data);

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Marine API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marine data' },
      { status: 502 }
    );
  }
}
