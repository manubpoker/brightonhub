import type { NhsOdsOrganisation } from '@/types/api';
import type { HealthFacility, HealthOverview } from '@/types/domain';
import { BRIGHTON_HOSPITALS } from '@/lib/data/brighton-hospitals';

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
  // Filter out ODS hospital results (unreliable via postcode) and use static data instead
  const odsFacilities = organisations
    .filter((org) => org.PrimaryRoleId !== 'RO108')
    .map((org) => transformOrganisation(org, locations));
  const facilities = [...odsFacilities, ...BRIGHTON_HOSPITALS];

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
