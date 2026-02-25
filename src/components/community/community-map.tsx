'use client';

import { BrightonMap, type MapMarker, type MapLegendItem } from '@/components/map/brighton-map';
import type { FoodBank } from '@/types/domain';
import { MARKER_COLORS } from '@/lib/constants';

interface CommunityMapProps {
  foodBanks: FoodBank[];
  className?: string;
}

const COMMUNITY_LEGEND: MapLegendItem[] = [
  { type: 'community', label: 'Food Bank', color: MARKER_COLORS.community },
];

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m away`;
  return `${(meters / 1000).toFixed(1)}km away`;
}

export function CommunityMap({ foodBanks, className }: CommunityMapProps) {
  const markers: MapMarker[] = foodBanks
    .filter((fb) => fb.location.lat !== 0 && fb.location.lng !== 0)
    .map((fb) => ({
      id: fb.id,
      position: [fb.location.lat, fb.location.lng],
      type: 'community',
      label: fb.name,
      popup: fb.distance_m > 0 ? formatDistance(fb.distance_m) : fb.address,
      value: fb.hasNeeds ? `Needs: ${fb.needs.slice(0, 3).join(', ')}` : undefined,
    }));

  return (
    <BrightonMap
      markers={markers}
      legendItems={COMMUNITY_LEGEND}
      className={className}
    />
  );
}
