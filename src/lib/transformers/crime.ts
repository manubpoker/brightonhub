import type { PoliceUkCrimeResponse, PoliceUkNeighbourhoodDetailResponse, PoliceUkOfficerResponse } from '@/types/api';
import type { CrimeIncident, CrimeSummary, CrimeCategoryCount, CrimeAreaCount, CrimeOutcomeCount, HazardAlert, NeighbourhoodInfo, NeighbourhoodOfficer, Severity } from '@/types/domain';
import { BRIGHTON_LAT, BRIGHTON_LNG, CRIME_CATEGORY_LABELS, CRIME_SEVERITY_THRESHOLDS } from '@/lib/constants';

export interface CrimeData {
  incidents: CrimeIncident[];
  summary: CrimeSummary;
  alert: HazardAlert;
}

export interface NeighbourhoodData {
  info: NeighbourhoodInfo;
}

function getCrimeSeverity(totalCrimes: number): Severity {
  if (totalCrimes > CRIME_SEVERITY_THRESHOLDS.warning) return 'severe';
  if (totalCrimes > CRIME_SEVERITY_THRESHOLDS.alert) return 'warning';
  if (totalCrimes > CRIME_SEVERITY_THRESHOLDS.normal) return 'alert';
  return 'normal';
}

// Outcome labels for clearer display
const OUTCOME_LABELS: Record<string, string> = {
  'Unable to prosecute suspect': 'Unable to prosecute',
  'Investigation complete; no suspect identified': 'No suspect identified',
  'Under investigation': 'Under investigation',
  'Local resolution': 'Local resolution',
  'Offender given a caution': 'Caution given',
  'Offender given penalty notice': 'Penalty notice',
  'Court result unavailable': 'Court result pending',
  'Awaiting court outcome': 'Awaiting court',
  'Suspect charged as part of another case': 'Charged (another case)',
  'Offender sent to prison': 'Sent to prison',
  'Offender given community sentence': 'Community sentence',
  'Offender given conditional discharge': 'Conditional discharge',
  'Offender given suspended prison sentence': 'Suspended sentence',
  'Offender otherwise dealt with': 'Otherwise dealt with',
  'Action taken by another organisation': 'Action by other org',
  'Formal action is not in the public interest': 'Not in public interest',
  'Offender fined': 'Fined',
  'Offender given absolute discharge': 'Absolute discharge',
  'Defendant found not guilty': 'Not guilty',
};

interface AreaCrimeInput {
  area: string;
  label: string;
  crimes: PoliceUkCrimeResponse[];
}

export function transformMultiAreaCrimeResponse(areas: AreaCrimeInput[]): CrimeData {
  const incidents: CrimeIncident[] = [];

  for (const { area, crimes } of areas) {
    for (const crime of crimes) {
      incidents.push({
        id: crime.persistent_id || String(crime.id),
        category: crime.category,
        location: {
          lat: parseFloat(crime.location.latitude),
          lng: parseFloat(crime.location.longitude),
        },
        street: crime.location.street.name,
        outcome: crime.outcome_status?.category ?? null,
        month: crime.month,
        area,
      });
    }
  }

  // Deduplicate by id (API may return overlapping results for nearby areas)
  const seen = new Set<string>();
  const dedupedIncidents = incidents.filter((inc) => {
    if (seen.has(inc.id)) return false;
    seen.add(inc.id);
    return true;
  });

  // Count by category
  const categoryMap = new Map<string, number>();
  for (const incident of dedupedIncidents) {
    const cat = incident.category;
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }

  const categories: CrimeCategoryCount[] = Array.from(categoryMap.entries())
    .map(([category, count]) => ({
      category: CRIME_CATEGORY_LABELS[category] ?? category,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Count by area
  const areaMap = new Map<string, number>();
  for (const incident of dedupedIncidents) {
    areaMap.set(incident.area, (areaMap.get(incident.area) ?? 0) + 1);
  }

  const areaBreakdown: CrimeAreaCount[] = areas.map(({ area, label }) => ({
    area,
    label,
    count: areaMap.get(area) ?? 0,
  }));

  // Count by outcome
  const outcomeMap = new Map<string, number>();
  for (const incident of dedupedIncidents) {
    const key = incident.outcome ?? 'No outcome recorded';
    outcomeMap.set(key, (outcomeMap.get(key) ?? 0) + 1);
  }

  const outcomeBreakdown: CrimeOutcomeCount[] = Array.from(outcomeMap.entries())
    .map(([outcome, count]) => ({
      outcome: OUTCOME_LABELS[outcome] ?? outcome,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const month = dedupedIncidents.length > 0 ? dedupedIncidents[0].month : 'Unknown';
  const severity = getCrimeSeverity(dedupedIncidents.length);

  const summary: CrimeSummary = {
    totalCrimes: dedupedIncidents.length,
    month,
    categories,
    areaBreakdown,
    outcomeBreakdown,
    severity,
  };

  const alert: HazardAlert = {
    id: `crime-${month}`,
    source: 'crime',
    severity,
    title: `${dedupedIncidents.length} crimes reported across BN1-BN3`,
    description: `Top: ${categories[0]?.category ?? 'Unknown'} (${categories[0]?.count ?? 0}). Areas: ${areaBreakdown.map((a) => `${a.area}: ${a.count}`).join(', ')}`,
    location: { lat: BRIGHTON_LAT, lng: BRIGHTON_LNG },
    timestamp: new Date().toISOString(),
  };

  return { incidents: dedupedIncidents, summary, alert };
}

// Keep backward compatible single-area transform
export function transformCrimeResponse(raw: PoliceUkCrimeResponse[]): CrimeData {
  return transformMultiAreaCrimeResponse([{ area: 'BN1', label: 'BN1 — Central Brighton', crimes: raw }]);
}

export function transformNeighbourhoodResponse(
  detail: PoliceUkNeighbourhoodDetailResponse,
  officers: PoliceUkOfficerResponse[]
): NeighbourhoodData {
  const team: NeighbourhoodOfficer[] = officers.map((o) => ({
    name: o.name,
    rank: o.rank,
    bio: o.bio,
  }));

  return {
    info: {
      id: detail.id,
      name: detail.name,
      team,
      description: detail.description ?? '',
      contactEmail: detail.contact_details?.email ?? null,
      contactPhone: detail.contact_details?.telephone ?? null,
    },
  };
}
