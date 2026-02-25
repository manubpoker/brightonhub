'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BRIGHTON_LAT, BRIGHTON_LNG, MAP_DEFAULT_ZOOM, MARKER_COLORS } from '@/lib/constants';
import type { MapMarker, MapLegendItem } from './brighton-map';

const DEFAULT_LEGEND: MapLegendItem[] = [
  { type: 'flood', label: 'Flood Station', color: MARKER_COLORS.flood },
  { type: 'air-quality', label: 'Air Quality', color: MARKER_COLORS['air-quality'] },
  { type: 'carbon', label: 'Carbon (Regional)', color: MARKER_COLORS.carbon },
];

interface MapInnerProps {
  markers: MapMarker[];
  legendItems?: MapLegendItem[];
}

export default function MapInner({ markers, legendItems }: MapInnerProps) {
  const legend = legendItems ?? DEFAULT_LEGEND;

  return (
    <MapContainer
      center={[BRIGHTON_LAT, BRIGHTON_LNG]}
      zoom={MAP_DEFAULT_ZOOM}
      className="h-full w-full min-h-[400px] rounded-lg z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={marker.position}
          radius={8}
          fillColor={MARKER_COLORS[marker.type] ?? '#6b7280'}
          color="#fff"
          weight={2}
          fillOpacity={0.8}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{marker.label}</p>
              <p className="text-gray-600">{marker.popup}</p>
              {marker.value && (
                <p className="font-medium mt-1">{marker.value}</p>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Map legend */}
      {legend.length > 0 && (
        <div className="leaflet-bottom leaflet-left">
          <div className="leaflet-control bg-white rounded-md shadow-md p-2 m-2 text-xs">
            <p className="font-semibold mb-1">Legend</p>
            <div className="flex flex-col gap-1">
              {legend.map((item) => (
                <div key={item.type} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </MapContainer>
  );
}
