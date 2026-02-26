import type { OverpassResponse } from '@/types/api';
import type { School, SchoolsOverview } from '@/types/domain';

export type SchoolsData = SchoolsOverview;

export function transformSchoolsResponse(raw: OverpassResponse): SchoolsData {
  const schools: School[] = (raw.elements ?? [])
    .filter((el) => (el.lat != null || el.center?.lat != null) && el.tags?.name)
    .map((el) => {
      const lat = el.lat ?? el.center!.lat;
      const lon = el.lon ?? el.center!.lon;
      return {
        id: String(el.id),
        name: el.tags!.name!,
        type: el.tags!['school:type'] ?? el.tags!.school_type ?? el.tags!.isced ?? 'school',
        address: [el.tags!['addr:street'], el.tags!['addr:city']].filter(Boolean).join(', '),
        location: { lat, lng: lon },
        operator: el.tags!.operator ?? null,
        website: el.tags!.website ?? null,
      };
    });

  return {
    schools,
    totalCount: schools.length,
    severity: 'normal',
  };
}
