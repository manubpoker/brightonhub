'use client';

import { BrightonMap, type MapMarker, type MapLegendItem } from '@/components/map/brighton-map';
import type { School } from '@/types/domain';
import { MARKER_COLORS } from '@/lib/constants';

interface SchoolsMapProps {
  schools: School[];
  className?: string;
}

const SCHOOLS_LEGEND: MapLegendItem[] = [
  { type: 'schools', label: 'School', color: MARKER_COLORS.schools },
];

export function SchoolsMap({ schools, className }: SchoolsMapProps) {
  const markers: MapMarker[] = schools
    .filter((s) => s.location.lat !== 0 && s.location.lng !== 0)
    .map((s) => ({
      id: s.id,
      position: [s.location.lat, s.location.lng],
      type: 'schools',
      label: s.name,
      popup: [s.address, s.operator].filter(Boolean).join(' — ') || 'School',
    }));

  return (
    <BrightonMap
      markers={markers}
      legendItems={SCHOOLS_LEGEND}
      className={className}
    />
  );
}
