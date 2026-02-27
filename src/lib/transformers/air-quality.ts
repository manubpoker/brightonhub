import type { UKAirTimeseriesResponse } from '@/types/api';
import type { AirQualityReading, HazardAlert, PollutantReading, Severity } from '@/types/domain';
import { DAQI_BANDS, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';

export interface AirQualityData {
  reading: AirQualityReading | null;
  alert: HazardAlert;
}

// DEFRA DAQI breakpoints (ug/m3) — only the 5 official DAQI pollutants
// See: https://uk-air.defra.gov.uk/air-pollution/daqi
const DAQI_BREAKPOINTS: Record<string, number[]> = {
  'nitrogen dioxide': [0, 67, 134, 200, 267, 334, 400, 467, 534, 600],
  'pm2.5':            [0, 12, 24, 36, 42, 47, 53, 58, 64, 70],
  'pm10':             [0, 17, 34, 51, 59, 67, 75, 84, 92, 100],
  'ozone':            [0, 34, 67, 100, 121, 141, 160, 188, 214, 240],
  'sulphur dioxide':  [0, 89, 177, 266, 355, 444, 533, 711, 888, 1065],
};

/** Check if a pollutant name is one of the 5 official DAQI pollutants. */
function isDaqiPollutant(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.includes('nitrogen dioxide') ||
    lower.includes('ozone') ||
    lower.includes('sulphur dioxide') ||
    /pm\s*2\.?5|particulate.*2\.5/.test(lower) ||
    /pm\s*10|particulate.*10/.test(lower)
  );
}

function calculatePollutantIndex(name: string, value: number): { index: number; band: string; isDaqi: boolean } {
  const lower = name.toLowerCase();
  let breakpoints: number[] | undefined;

  if (lower.includes('nitrogen dioxide')) {
    breakpoints = DAQI_BREAKPOINTS['nitrogen dioxide'];
  } else if (/pm\s*2\.?5|particulate.*2\.5/.test(lower)) {
    breakpoints = DAQI_BREAKPOINTS['pm2.5'];
  } else if (/pm\s*10|particulate.*10/.test(lower)) {
    breakpoints = DAQI_BREAKPOINTS['pm10'];
  } else if (lower.includes('ozone')) {
    breakpoints = DAQI_BREAKPOINTS['ozone'];
  } else if (lower.includes('sulphur dioxide')) {
    breakpoints = DAQI_BREAKPOINTS['sulphur dioxide'];
  }

  // Non-DAQI pollutant (NO, NOx, etc.) — report value but don't contribute to DAQI
  if (!breakpoints) {
    return { index: 1, band: 'Low', isDaqi: false };
  }

  let index = 1;
  for (let i = 1; i < breakpoints.length; i++) {
    if (value >= breakpoints[i]) {
      index = i + 1;
    }
  }
  index = Math.min(index, 10);

  const daqiBand = DAQI_BANDS.find((b) => index >= b.min && index <= b.max);
  return { index, band: daqiBand?.band ?? 'Low', isDaqi: true };
}

interface TimeseriesWithDistance extends UKAirTimeseriesResponse {
  _lat?: number;
  _lng?: number;
  _dist?: number;
}

// Primary entry point - works with timeseries items directly
export function transformAirQualityFromTimeseries(
  timeseries: TimeseriesWithDistance[]
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
    .filter((ts) => ts.lastValue?.value != null)
    .map((ts) => {
      // Extract pollutant name from station label: "Brighton Preston Park-Nitrogen dioxide (air)"
      const label = ts.station?.properties?.label ?? '';
      const afterDash = label.split('-').slice(1).join('-').trim();
      // Clean up: "Nitrogen dioxide (air)" -> "Nitrogen dioxide"
      const cleanedName = afterDash.replace(/\s*\(.*?\)\s*$/, '');
      const name = cleanedName || (ts.parameters?.phenomenon?.label ?? 'Unknown');
      const value = ts.lastValue?.value ?? 0;
      const unit = ts.uom?.replace('ug.m-3', 'ug/m3') ?? 'ug/m3';
      const { index, band } = calculatePollutantIndex(name, value);

      return { name, value, unit, index, band };
    });

  // DAQI is determined by the worst-performing of the 5 official pollutants only
  // (NO2, O3, PM2.5, PM10, SO2) — not NO, NOx, or other measured species
  const daqiPollutants = pollutants.filter((p) => isDaqiPollutant(p.name));
  const overallIndex = daqiPollutants.length > 0
    ? Math.max(...daqiPollutants.map((p) => p.index))
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
