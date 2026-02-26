import type { FloodWarningsResponse, FloodStationsResponse } from '@/types/api';
import type { FloodWarning, FloodStation, HazardAlert, Severity } from '@/types/domain';
import { FLOOD_SEVERITY_MAP, BRIGHTON_LAT, BRIGHTON_LNG } from '@/lib/constants';

export interface FloodWarningsData {
  warnings: FloodWarning[];
  alerts: HazardAlert[];
}

export interface FloodStationsData {
  stations: FloodStation[];
}

export function transformFloodWarnings(raw: FloodWarningsResponse): FloodWarningsData {
  const items = raw?.items ?? [];

  const warnings: FloodWarning[] = items.map((item) => {
    const severityLevel = item.severityLevel ?? 4;
    const severity: Severity = FLOOD_SEVERITY_MAP[severityLevel] ?? 'normal';

    return {
      id: item['@id'] ?? item.floodAreaID ?? '',
      severity,
      severityLevel,
      title: item.description ?? 'Flood warning',
      description: item.message ?? '',
      area: item.eaAreaName ?? '',
      timeRaised: item.timeRaised ?? '',
      timeUpdated: item.timeMessageChanged ?? item.timeSeverityChanged ?? '',
    };
  });

  // Sort by severity (most severe first)
  warnings.sort((a, b) => a.severityLevel - b.severityLevel);

  const alerts: HazardAlert[] = warnings
    .filter((w) => w.severity !== 'normal')
    .map((w) => ({
      id: w.id,
      source: 'flood' as const,
      severity: w.severity,
      title: w.title,
      description: w.description.slice(0, 200),
      location: { lat: BRIGHTON_LAT, lng: BRIGHTON_LNG },
      timestamp: w.timeRaised,
    }));

  return { warnings, alerts };
}

export function transformFloodStations(raw: FloodStationsResponse): FloodStationsData {
  const items = raw?.items ?? [];

  const stations: FloodStation[] = items
    .filter((item) => item.lat && item.long)
    .map((item) => {
      // measures can be an array or a single object
      const measures = Array.isArray(item.measures)
        ? item.measures
        : item.measures
          ? [item.measures]
          : [];

      const primaryMeasure = measures.find(
        (m) => m.parameter === 'level' || m.parameterName === 'Water Level'
      ) ?? measures[0];

      return {
        id: item.stationReference ?? item['@id'] ?? '',
        name: item.label ?? 'Unknown station',
        location: { lat: item.lat, lng: item.long },
        river: item.riverName ?? '',
        parameter: primaryMeasure?.parameterName ?? primaryMeasure?.parameter ?? 'level',
        latestValue: primaryMeasure?.latestReading?.value ?? null,
        unit: primaryMeasure?.unitName ?? 'm',
        timestamp: primaryMeasure?.latestReading?.dateTime ?? null,
      };
    });

  return { stations };
}
