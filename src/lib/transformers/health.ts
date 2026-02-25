import type { NhsOdsOrganisation } from '@/types/api';
import type { HealthFacility, HealthOverview } from '@/types/domain';

export type HealthData = HealthOverview;

const ROLE_TYPE_MAP: Record<string, HealthFacility['type']> = {
  RO177: 'gp',
  RO197: 'pharmacy',
  RO108: 'hospital',
  RO110: 'dental',
};

function transformOrganisation(
  org: NhsOdsOrganisation,
  locations: Map<string, { lat: number; lng: number }>,
): HealthFacility {
  return {
    id: org.OrgId,
    name: org.Name,
    type: ROLE_TYPE_MAP[org.PrimaryRoleId] ?? 'gp',
    address: '',
    postcode: org.PostCode ?? '',
    phone: null,
    location: locations.get(org.PostCode) ?? null,
  };
}

export function transformHealthResponse(
  organisations: NhsOdsOrganisation[],
  locations: Map<string, { lat: number; lng: number }> = new Map(),
): HealthData {
  const facilities = organisations.map((org) => transformOrganisation(org, locations));

  const counts = {
    gps: facilities.filter((f) => f.type === 'gp').length,
    pharmacies: facilities.filter((f) => f.type === 'pharmacy').length,
    hospitals: facilities.filter((f) => f.type === 'hospital').length,
    dentists: facilities.filter((f) => f.type === 'dental').length,
  };

  return {
    facilities,
    counts,
    severity: 'normal',
  };
}
