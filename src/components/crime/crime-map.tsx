'use client';

import { BrightonMap, type MapMarker, type MapLegendItem } from '@/components/map/brighton-map';
import type { CrimeIncident } from '@/types/domain';
import { MARKER_COLORS, CRIME_CATEGORY_LABELS } from '@/lib/constants';

interface CrimeMapProps {
  incidents: CrimeIncident[];
  className?: string;
}

const CRIME_LEGEND: MapLegendItem[] = [
  { type: 'crime-BN1', label: 'BN1 — Central', color: MARKER_COLORS['crime-BN1'] },
  { type: 'crime-BN2', label: 'BN2 — East', color: MARKER_COLORS['crime-BN2'] },
  { type: 'crime-BN3', label: 'BN3 — Hove', color: MARKER_COLORS['crime-BN3'] },
  { type: 'crime-BN41', label: 'BN41 — Southwick', color: MARKER_COLORS['crime-BN41'] },
  { type: 'crime-BN42', label: 'BN42 — Shoreham W', color: MARKER_COLORS['crime-BN42'] },
  { type: 'crime-BN43', label: 'BN43 — Shoreham E', color: MARKER_COLORS['crime-BN43'] },
];

export function CrimeMap({ incidents, className }: CrimeMapProps) {
  // Limit to first 300 markers for performance
  const markers: MapMarker[] = incidents.slice(0, 300).map((incident) => ({
    id: incident.id,
    position: [incident.location.lat, incident.location.lng],
    type: `crime-${incident.area}`,
    label: CRIME_CATEGORY_LABELS[incident.category] ?? incident.category,
    popup: `${incident.street} (${incident.area})`,
    value: incident.outcome ?? undefined,
  }));

  return (
    <BrightonMap
      markers={markers}
      legendItems={CRIME_LEGEND}
      className={className}
    />
  );
}
