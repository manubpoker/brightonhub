import type { CarbonIntensityResponse, CarbonRegionData } from '@/types/api';
import type { CarbonIntensity, HazardAlert } from '@/types/domain';
import { CARBON_INDEX_TO_SEVERITY, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';
import type { Severity } from '@/types/domain';

export interface CarbonData {
  current: CarbonIntensity;
  forecast: CarbonIntensity[];
  alert: HazardAlert;
}

/** Extract the region object from a response where `data` may be an array or a single object. */
function extractRegion(raw: CarbonIntensityResponse): CarbonRegionData | undefined {
  if (Array.isArray(raw?.data)) return raw.data[0];
  return raw?.data ?? undefined;
}

export function transformCarbonResponse(
  currentRaw: CarbonIntensityResponse,
  forecastRaw: CarbonIntensityResponse | null
): CarbonData {
  const region = extractRegion(currentRaw);
  const entry = region?.data?.[0];

  if (!entry) {
    throw new Error('Unexpected carbon API response format');
  }

  const currentIntensity: CarbonIntensity = {
    forecast: entry.intensity.forecast,
    actual: null,
    index: entry.intensity.index,
    from: entry.from,
    to: entry.to,
    generationMix: (entry.generationmix ?? []).map(
      (g: { fuel: string; perc: number }) => ({
        fuel: g.fuel,
        perc: g.perc,
      })
    ),
  };

  const severity: Severity =
    CARBON_INDEX_TO_SEVERITY[currentIntensity.index.toLowerCase()] ?? 'normal';

  const alert: HazardAlert = {
    id: 'carbon-current',
    source: 'carbon',
    severity,
    title: `Carbon Intensity: ${capitalize(currentIntensity.index)}`,
    description: `Current forecast: ${currentIntensity.forecast} gCO2/kWh`,
    location: { lat: BRIGHTON_LAT, lng: BRIGHTON_LNG },
    timestamp: currentIntensity.from,
  };

  // Transform forecast data
  let forecastEntries: CarbonIntensity[] = [];
  if (forecastRaw) {
    const forecastRegion = extractRegion(forecastRaw);
    const items = forecastRegion?.data ?? [];
    forecastEntries = items.map(
      (item) => ({
        forecast: item.intensity.forecast,
        actual: null,
        index: item.intensity.index,
        from: item.from,
        to: item.to,
        generationMix: (item.generationmix ?? []).map(
          (g: { fuel: string; perc: number }) => ({
            fuel: g.fuel,
            perc: g.perc,
          })
        ),
      })
    );
  }

  return {
    current: currentIntensity,
    forecast: forecastEntries,
    alert,
  };
}

function capitalize(s: string): string {
  return s
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
