'use client';

import { BrightonMap, type MapMarker, type MapLegendItem } from '@/components/map/brighton-map';
import type { PlanningApplication } from '@/types/domain';
import { MARKER_COLORS } from '@/lib/constants';

interface PlanningMapProps {
  applications: PlanningApplication[];
  className?: string;
}

const PLANNING_LEGEND: MapLegendItem[] = [
  { type: 'planning', label: 'Planning Application', color: MARKER_COLORS.planning },
];

export function PlanningMap({ applications, className }: PlanningMapProps) {
  const markers: MapMarker[] = applications
    .filter((app) => app.location !== null)
    .map((app) => ({
      id: app.id,
      position: [app.location!.lat, app.location!.lng],
      type: 'planning',
      label: app.reference,
      popup: app.description.slice(0, 100),
      value: app.status,
    }));

  return (
    <BrightonMap
      markers={markers}
      legendItems={PLANNING_LEGEND}
      className={className}
    />
  );
}
