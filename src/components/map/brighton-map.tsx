'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Leaflet must be loaded client-side only (no SSR)
const MapInner = dynamic(() => import('./map-inner'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full min-h-[400px]">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  ),
});

export interface MapMarker {
  id: string;
  position: [number, number];
  type: string;
  label: string;
  popup: string;
  value?: string;
}

export interface MapLegendItem {
  type: string;
  label: string;
  color: string;
}

interface BrightonMapProps {
  markers: MapMarker[];
  legendItems?: MapLegendItem[];
  className?: string;
}

export function BrightonMap({ markers, legendItems, className }: BrightonMapProps) {
  return (
    <div className={className}>
      <MapInner markers={markers} legendItems={legendItems} />
    </div>
  );
}
