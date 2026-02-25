import type { AirQualityReading, HazardAlert, PollutantReading, Severity } from '@/types/domain';
import { DAQI_BANDS, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';

export interface AirQualityData {
  reading: AirQualityReading | null;
  alert: HazardAlert;
}

// Simplified DAQI calculation based on pollutant concentrations (µg/m³)
function calculatePollutantIndex(name: string, value: number): { index: number; band: string } {
  const lower = name.toLowerCase();
  let breakpoints: number[];

  if (lower.includes('nitrogen dioxide') || lower.includes('no2')) {
    breakpoints = [0, 67, 134, 200, 267, 334, 400, 467, 534, 600];
  } else if (lower.includes('2.5') || lower.includes('pm2')) {
    breakpoints = [0, 12, 24, 36, 42, 47, 53, 58, 64, 70];
  } else if (lower.includes('10') || lower.includes('pm10')) {
    breakpoints = [0, 17, 34, 51, 59, 67, 75, 84, 92, 100];
  } else if (lower.includes('ozone') || lower.includes('o3')) {
    breakpoints = [0, 34, 67, 100, 121, 141, 160, 188, 214, 240];
  } else if (lower.includes('sulphur') || lower.includes('so2')) {
    breakpoints = [0, 89, 177, 266, 355, 444, 533, 711, 888, 1065];
  } else {
    return { index: 1, band: 'Low' };
  }

  let index = 1;
  for (let i = 1; i < breakpoints.length; i++) {
    if (value >= breakpoints[i]) {
      index = i + 1;
    }
  }
  index = Math.min(index, 10);

  const daqiBand = DAQI_BANDS.find((b) => index >= b.min && index <= b.max);
  return { index, band: daqiBand?.band ?? 'Low' };
}

// New primary entry point — works with timeseries items directly
export function transformAirQualityFromTimeseries(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeseries: any[]
): AirQualityData {
  if (!timeseries || timeseries.length === 0) {
    return {
      reading: null,
      alert: {
        id: 'air-quality-current',
        source: 'air-quality',
        severity: 'normal',
        title: 'Air Quality: Data Unavailable',
        description: 'No recent air quality data available for Brighton',
        location: { lat: BRIGHTON_LAT, lng: BRIGHTON_LNG },
        timestamp: new Date().toISOString(),
      },
    };
  }

  const first = timeseries[0];
  const rawLabel = first.station?.properties?.label ?? 'Unknown Station';
  // Extract base station name: "Brighton Preston Park-Nitrogen dioxide (air)" -> "Brighton Preston Park"
  const stationName = rawLabel.split('-')[0].trim() || rawLabel;
  const stationId = String(first.station?.properties?.id ?? '');

  // Extract lat/lng
  const coords = first.station?.geometry?.coordinates ?? [BRIGHTON_LAT, BRIGHTON_LNG];
  const lat = first._lat ?? coords[0] ?? BRIGHTON_LAT;
  const lng = first._lng ?? coords[1] ?? BRIGHTON_LNG;

  const pollutants: PollutantReading[] = timeseries
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ts: any) => ts.lastValue?.value != null
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((ts: any) => {
      // Extract pollutant name from station label: "Brighton Preston Park-Nitrogen dioxide (air)"
      const rawLabel = ts.station?.properties?.label ?? '';
      const afterDash = rawLabel.split('-').slice(1).join('-').trim();
      // Clean up: "Nitrogen dioxide (air)" -> "Nitrogen dioxide"
      const cleanedName = afterDash.replace(/\s*\(.*?\)\s*$/, '');
      const name = cleanedName || (ts.parameters?.phenomenon?.label ?? 'Unknown');
      const value = ts.lastValue?.value ?? 0;
      const unit = ts.uom?.replace('ug.m-3', 'µg/m³') ?? 'µg/m³';
      const { index, band } = calculatePollutantIndex(name, value);

      return { name, value, unit, index, band };
    });

  const overallIndex = pollutants.length > 0
    ? Math.max(...pollutants.map((p) => p.index))
    : 1;
  const daqiBand = DAQI_BANDS.find((b) => overallIndex >= b.min && overallIndex <= b.max);
  const overallBand = daqiBand?.band ?? 'Low';
  const overallSeverity: Severity = daqiBand?.severity ?? 'normal';

  const reading: AirQualityReading = {
    stationId,
    stationName,
    location: { lat, lng },
    pollutants,
    overallIndex,
    overallBand,
  };

  const alert: HazardAlert = {
    id: 'air-quality-current',
    source: 'air-quality',
    severity: overallSeverity,
    title: `Air Quality: ${overallBand}`,
    description: pollutants
      .map((p) => `${p.name}: ${p.value?.toFixed(1)} ${p.unit}`)
      .join(', ') || 'No pollutant data',
    location: { lat, lng },
    timestamp: new Date().toISOString(),
  };

  return { reading, alert };
}

// Legacy entry point kept for compatibility
export function transformAirQuality(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  station: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeseries: any[]
): AirQualityData {
  return transformAirQualityFromTimeseries(timeseries);
}
