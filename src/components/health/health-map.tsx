'use client';

import { BrightonMap, type MapMarker, type MapLegendItem } from '@/components/map/brighton-map';
import type { HealthFacility } from '@/types/domain';
import { MARKER_COLORS } from '@/lib/constants';

interface HealthMapProps {
  facilities: HealthFacility[];
  className?: string;
}

const TYPE_LABELS: Record<string, string> = {
  gp: 'GP Practice',
  pharmacy: 'Pharmacy',
  hospital: 'Hospital',
  dental: 'Dentist',
};

const HEALTH_LEGEND: MapLegendItem[] = [
  { type: 'health-gp', label: 'GP Practice', color: MARKER_COLORS['health-gp'] },
  { type: 'health-pharmacy', label: 'Pharmacy', color: MARKER_COLORS['health-pharmacy'] },
  { type: 'health-hospital', label: 'Hospital', color: MARKER_COLORS['health-hospital'] },
  { type: 'health-dental', label: 'Dentist', color: MARKER_COLORS['health-dental'] },
];

export function HealthMap({ facilities, className }: HealthMapProps) {
  const markers: MapMarker[] = facilities
    .filter((f) => f.location !== null)
    .map((f) => ({
      id: f.id,
      position: [f.location!.lat, f.location!.lng],
      type: `health-${f.type}`,
      label: f.name,
      popup: `${TYPE_LABELS[f.type] ?? f.type} — ${f.postcode}`,
    }));

  return (
    <BrightonMap
      markers={markers}
      legendItems={HEALTH_LEGEND}
      className={className}
    />
  );
}
