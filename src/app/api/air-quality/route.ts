import { NextResponse } from 'next/server';
import { UKAIR_API_URL } from '@/lib/constants';
import { transformAirQualityFromTimeseries } from '@/lib/transformers/air-quality';

interface TimeseriesItem {
  id: number;
  label: string;
  uom: string;
  station: {
    properties: { id: number; label: string };
    geometry: { coordinates: number[] };
  };
  lastValue?: { timestamp: number; value: number };
  parameters?: {
    phenomenon?: { id: number; label: string };
  };
}

export async function GET() {
  try {
    // The UK-AIR 52North API lists timeseries (each = one pollutant at one station)
    // Coordinates are [lat, lng, NaN] format
    const res = await fetch(`${UKAIR_API_URL}/timeseries?expanded=true`, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`UK-AIR timeseries API returned ${res.status}`);
    }

    const allTimeseries: TimeseriesItem[] = await res.json();

    if (!Array.isArray(allTimeseries) || allTimeseries.length === 0) {
      return NextResponse.json(
        transformAirQualityFromTimeseries([])
      );
    }

    // Find timeseries near Brighton
    // API coords are [lat, lng, NaN] based on observed data
    const brightonLat = 50.8225;
    const brightonLng = -0.1372;

    const withDistance = allTimeseries
      .filter((ts) => {
        const coords = ts.station?.geometry?.coordinates;
        return coords && coords.length >= 2 && !isNaN(coords[0]) && !isNaN(coords[1]);
      })
      .map((ts) => {
        const coords = ts.station.geometry.coordinates;
        // Try both coordinate orderings and pick the one that makes sense for UK
        let lat = coords[0];
        let lng = coords[1];
        // If lat > 90, coords are probably [lng, lat] — but UK lat is ~50-59
        // If first coord is ~50-59, it's likely [lat, lng]
        if (lat > 90 || lat < -90) {
          // Swap
          [lat, lng] = [lng, lat];
        }
        const dist = Math.hypot(lat - brightonLat, lng - brightonLng);
        return { ...ts, _lat: lat, _lng: lng, _dist: dist };
      })
      .sort((a, b) => a._dist - b._dist);

    // Extract the base station name (before the dash+pollutant)
    // e.g. "Brighton Preston Park-Nitrogen dioxide (air)" -> "Brighton Preston Park"
    const closestLabel = withDistance[0]?.station?.properties?.label ?? '';
    const baseStationName = closestLabel.split('-')[0].trim();
    if (!baseStationName) {
      return NextResponse.json(transformAirQualityFromTimeseries([]));
    }

    // Get all timeseries from that station (matching by base name prefix)
    const stationTimeseries = withDistance.filter(
      (ts) => (ts.station?.properties?.label ?? '').startsWith(baseStationName)
    );

    const transformed = transformAirQualityFromTimeseries(stationTimeseries);

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Air quality API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch air quality data' },
      { status: 502 }
    );
  }
}
