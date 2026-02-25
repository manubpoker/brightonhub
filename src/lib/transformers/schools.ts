import type { OverpassResponse } from '@/types/api';
import type { School, SchoolsOverview } from '@/types/domain';

export type SchoolsData = SchoolsOverview;

export function transformSchoolsResponse(raw: OverpassResponse): SchoolsData {
  const schools: School[] = (raw.elements ?? [])
    .filter((el) => el.lat != null && el.lon != null && el.tags?.name)
    .map((el) => ({
      id: String(el.id),
      name: el.tags!.name!,
      type: el.tags!['school:type'] ?? el.tags!.school_type ?? el.tags!.isced ?? 'school',
      address: [el.tags!['addr:street'], el.tags!['addr:city']].filter(Boolean).join(', '),
      location: { lat: el.lat!, lng: el.lon! },
      operator: el.tags!.operator ?? null,
      website: el.tags!.website ?? null,
    }));

  return {
    schools,
    totalCount: schools.length,
    severity: 'normal',
  };
}
