import { NextResponse } from 'next/server';
import { CARBON_API_URL, BRIGHTON_POSTCODE } from '@/lib/constants';
import { transformCarbonResponse } from '@/lib/transformers/carbon';

export async function GET() {
  try {
    // Fetch current + 24h forecast
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `${CARBON_API_URL}/regional/postcode/${BRIGHTON_POSTCODE}`,
        { next: { revalidate: 300 }, signal: AbortSignal.timeout(10000) }
      ),
      fetch(
        `${CARBON_API_URL}/regional/intensity/${new Date().toISOString().slice(0, 16)}Z/fw24h/postcode/${BRIGHTON_POSTCODE}`,
        { next: { revalidate: 300 }, signal: AbortSignal.timeout(10000) }
      ),
    ]);

    if (!currentRes.ok) {
      throw new Error(`Carbon API returned ${currentRes.status}`);
    }

    const currentData = await currentRes.json();
    const forecastData = forecastRes.ok ? await forecastRes.json() : null;

    const transformed = transformCarbonResponse(currentData, forecastData);

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Carbon API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carbon intensity data' },
      { status: 502 }
    );
  }
}
