import type { PlanningDataResponse } from '@/types/api';
import type { PlanningApplication, PlanningOverview } from '@/types/domain';

export type PlanningData = PlanningOverview;

function parseWktPoint(wkt: string | undefined): { lat: number; lng: number } | null {
  if (!wkt) return null;
  // WKT format: "POINT(lng lat)"
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (!match) return null;
  const lng = parseFloat(match[1]);
  const lat = parseFloat(match[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

export function transformPlanningResponse(raw: PlanningDataResponse): PlanningData {
  const applications: PlanningApplication[] = (raw.entities ?? []).map((entity) => ({
    id: entity.reference || String(entity.entity),
    reference: entity.reference || 'Unknown',
    description: entity.description || 'No description',
    address: '', // Not available in the national planning data API
    status: entity['decision-date'] ? 'Decided' : 'Pending',
    decisionDate: entity['decision-date'] ?? null,
    submissionDate: entity['start-date'] || entity['entry-date'],
    location: parseWktPoint(entity.point),
    applicationType: entity.prefix ?? 'planning-application',
  }));

  return {
    totalApplications: raw.count ?? applications.length,
    recentApplications: applications,
    severity: 'normal',
  };
}

