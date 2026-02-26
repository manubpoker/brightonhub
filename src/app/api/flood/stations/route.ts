import { NextResponse } from 'next/server';
import { FLOOD_API_URL, BRIGHTON_LAT, BRIGHTON_LNG, FLOOD_STATION_RADIUS_KM } from '@/lib/constants';
import { transformFloodStations } from '@/lib/transformers/flood';

export async function GET() {
  try {
    // Fetch water level stations near Brighton
    const stationsRes = await fetch(
      `${FLOOD_API_URL}/id/stations?lat=${BRIGHTON_LAT}&long=${BRIGHTON_LNG}&dist=${FLOOD_STATION_RADIUS_KM}&parameter=level&qualifier=Stage&_limit=20`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(10000) }
    );

    if (!stationsRes.ok) {
      throw new Error(`Flood stations API returned ${stationsRes.status}`);
    }

    const stationsData = await stationsRes.json();
    const items = stationsData?.items ?? [];

    // For each station, try to get latest reading from individual station endpoint
    // Use Promise.allSettled so one station failure doesn't block others
    const stationResults = await Promise.allSettled(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items.map(async (station: any) => {
        const stationUrl = station['@id'];
        if (!stationUrl) return station;

        const res = await fetch(stationUrl, {
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return station;
        const detail = await res.json();
        const fullStation = detail?.items ?? detail;
        if (fullStation?.measures) {
          return { ...station, measures: fullStation.measures };
        }
        return station;
      })
    );

    const enrichedItems = stationResults.map((result, i) =>
      result.status === 'fulfilled' ? result.value : items[i]
    );

    const transformed = transformFloodStations({ items: enrichedItems });

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Flood stations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flood station data' },
      { status: 502 }
    );
  }
}
