import type { CarbonIntensity, HazardAlert } from '@/types/domain';
import { CARBON_INDEX_TO_SEVERITY, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';
import type { Severity } from '@/types/domain';

export interface CarbonData {
  current: CarbonIntensity;
  forecast: CarbonIntensity[];
  alert: HazardAlert;
}

export function transformCarbonResponse(
  currentRaw: unknown,
  forecastRaw: unknown
): CarbonData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const current = currentRaw as any;
  const entry = current?.data?.data?.[0] ?? current?.data?.[0]?.data?.[0];

  if (!entry) {
    throw new Error('Unexpected carbon API response format');
  }

  const currentIntensity: CarbonIntensity = {
    forecast: entry.intensity.forecast,
    actual: entry.intensity.actual ?? null,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fRaw = forecastRaw as any;
    const items = fRaw?.data?.data ?? fRaw?.data?.[0]?.data ?? [];
    forecastEntries = items.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => ({
        forecast: item.intensity.forecast,
        actual: item.intensity.actual ?? null,
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
