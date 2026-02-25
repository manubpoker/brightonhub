import { NextResponse } from 'next/server';
import { NHS_ODS_API_URL, BRIGHTON_POSTCODES, POSTCODES_IO_API_URL } from '@/lib/constants';
import { transformHealthResponse } from '@/lib/transformers/health';
import type { NhsOdsOrganisation } from '@/types/api';

export const dynamic = 'force-dynamic';

const ROLE_IDS = ['RO177', 'RO197', 'RO108', 'RO110']; // GPs, pharmacies, hospitals, dentists

async function fetchOrgs(postcode: string, roleId: string): Promise<NhsOdsOrganisation[]> {
  const url = `${NHS_ODS_API_URL}?PostCode=${postcode}&Status=Active&PrimaryRoleId=${roleId}`;
  const res = await fetch(url, { next: { revalidate: 21600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.Organisations ?? [];
}

async function geocodePostcodes(postcodes: string[]): Promise<Map<string, { lat: number; lng: number }>> {
  const map = new Map<string, { lat: number; lng: number }>();
  if (postcodes.length === 0) return map;

  // postcodes.io bulk API: max 100 per request
  const batches: string[][] = [];
  for (let i = 0; i < postcodes.length; i += 100) {
    batches.push(postcodes.slice(i, i + 100));
  }

  for (const batch of batches) {
    try {
      const res = await fetch(POSTCODES_IO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcodes: batch }),
        next: { revalidate: 86400 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const entry of data.result ?? []) {
        if (entry.result?.latitude && entry.result?.longitude) {
          map.set(entry.query, {
            lat: entry.result.latitude,
            lng: entry.result.longitude,
          });
        }
      }
    } catch {
      // Continue without geocoding on failure
    }
  }

  return map;
}

export async function GET() {
  try {
    const queries = BRIGHTON_POSTCODES.flatMap((pc) =>
      ROLE_IDS.map((role) => fetchOrgs(pc, role))
    );

    const results = await Promise.all(queries);
    const allOrgs = results.flat();

    // Deduplicate by OrgId
    const seen = new Set<string>();
    const unique = allOrgs.filter((org) => {
      if (seen.has(org.OrgId)) return false;
      seen.add(org.OrgId);
      return true;
    });

    // Geocode all unique postcodes
    const postcodes = [...new Set(unique.map((o) => o.PostCode).filter(Boolean))];
    const locations = await geocodePostcodes(postcodes);

    const transformed = transformHealthResponse(unique, locations);
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Health API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 502 }
    );
  }
}
