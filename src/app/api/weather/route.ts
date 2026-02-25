import { NextResponse } from 'next/server';
import { OPENMETEO_API_URL, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';
import { transformWeatherResponse } from '@/lib/transformers/weather';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const params = new URLSearchParams({
      latitude: String(BRIGHTON_LAT),
      longitude: String(BRIGHTON_LNG),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
      hourly: 'temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max',
      timezone: 'Europe/London',
      forecast_days: '7',
    });

    const res = await fetch(`${OPENMETEO_API_URL}/forecast?${params}`, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo API returned ${res.status}`);
    }

    const data = await res.json();
    const transformed = transformWeatherResponse(data);

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 502 }
    );
  }
}
