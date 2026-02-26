'use client';

import { EnvStatusSummary } from '@/components/environment/env-status-summary';
import { AlertPanel } from '@/components/shared/alert-panel';
import { BrightonMap, type MapMarker } from '@/components/map/brighton-map';
import { useCarbon } from '@/lib/hooks/use-carbon';
import { useFlood, useFloodStations } from '@/lib/hooks/use-flood';
import { useAirQuality } from '@/lib/hooks/use-air-quality';
import { useBathingWater } from '@/lib/hooks/use-bathing-water';
import type { HazardAlert } from '@/types/domain';
import { severityOrder, formatTimeAgo } from '@/lib/utils';
import { BRIGHTON_LAT, BRIGHTON_LNG, BRIGHTON_BEACHES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, ExternalLink } from 'lucide-react';

export default function EnvironmentDashboard() {
  const carbon = useCarbon();
  const flood = useFlood();
  const floodStations = useFloodStations();
  const airQuality = useAirQuality();
  const bathingWater = useBathingWater();

  // Combine all alerts and sort by severity
  const allAlerts: HazardAlert[] = [];

  if (carbon.data?.alert) allAlerts.push(carbon.data.alert);
  if (flood.data?.alerts) allAlerts.push(...flood.data.alerts);
  if (airQuality.data?.alert) allAlerts.push(airQuality.data.alert);

  allAlerts.sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));

  // Build map markers
  const markers: MapMarker[] = [];

  // Flood station markers
  if (floodStations.data?.stations) {
    floodStations.data.stations.forEach((station) => {
      markers.push({
        id: `flood-${station.id}`,
        position: [station.location.lat, station.location.lng],
        type: 'flood',
        label: station.name,
        popup: station.river ? `River: ${station.river}` : 'Flood monitoring station',
        value: station.latestValue != null
          ? `${station.latestValue.toFixed(2)} ${station.unit}`
          : undefined,
      });
    });
  }

  // Air quality marker
  if (airQuality.data?.reading) {
    const r = airQuality.data.reading;
    markers.push({
      id: `aq-${r.stationId}`,
      position: [r.location.lat, r.location.lng],
      type: 'air-quality',
      label: r.stationName,
      popup: `DAQI: ${r.overallIndex}/10 (${r.overallBand})`,
      value: r.pollutants.map((p) => `${p.name}: ${p.value?.toFixed(1)}`).join(', '),
    });
  }

  // Carbon regional marker
  if (carbon.data?.current) {
    markers.push({
      id: 'carbon-regional',
      position: [BRIGHTON_LAT, BRIGHTON_LNG],
      type: 'carbon',
      label: 'Brighton Region',
      popup: `Carbon Intensity: ${carbon.data.current.index}`,
      value: `${carbon.data.current.forecast} gCO2/kWh`,
    });
  }

  // Beach markers
  if (bathingWater.data?.beaches) {
    bathingWater.data.beaches.forEach((beach) => {
      const beachCoords = BRIGHTON_BEACHES.find((b) => b.id === beach.id);
      if (beachCoords) {
        markers.push({
          id: `beach-${beach.id}`,
          position: [beachCoords.lat, beachCoords.lng],
          type: 'beach',
          label: beach.name,
          popup: `Water Quality: ${beach.classification}`,
          value: `${beach.classification} (${beach.sampleYear})`,
        });
      }
    });
  }

  const isLoading = carbon.isLoading || flood.isLoading || airQuality.isLoading;

  // Last updated timestamp
  const timestamps = [
    carbon.dataUpdatedAt,
    flood.dataUpdatedAt,
    airQuality.dataUpdatedAt,
  ].filter(Boolean);
  const lastUpdated = timestamps.length > 0
    ? formatTimeAgo(new Date(Math.max(...timestamps)).toISOString())
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Status cards row */}
      <EnvStatusSummary />

      {/* Map and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map takes 2/3 */}
        <div className="lg:col-span-2">
          <BrightonMap
            markers={markers}
            className="h-[400px] lg:h-[500px] rounded-lg overflow-hidden border"
          />
        </div>

        {/* Alert panel takes 1/3 */}
        <div className="lg:col-span-1">
          <AlertPanel alerts={allAlerts} loading={isLoading} />
        </div>
      </div>

      {/* Bathing water quality */}
      {bathingWater.data && bathingWater.data.beaches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Waves className="h-5 w-5 text-cyan-500" />
              Bathing Water Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bathingWater.data.beaches.map((beach) => {
                const badgeVariant =
                  beach.classification === 'Excellent' || beach.classification === 'Good'
                    ? 'default'
                    : beach.classification === 'Sufficient'
                      ? 'secondary'
                      : 'destructive';
                return (
                  <div key={beach.id} className="text-center rounded-lg border p-4">
                    <p className="font-semibold text-sm">{beach.name}</p>
                    <Badge variant={badgeVariant} className="mt-2">
                      {beach.classification}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      {beach.lastSampleDate
                        ? `Sampled: ${beach.lastSampleDate}`
                        : `Year: ${beach.sampleYear}`}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground/70 mt-3">
              Classification based on Environment Agency bathing water samples.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Useful Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ExternalLink className="h-4 w-4 text-green-600" />
            Useful Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Environment Agency', url: 'https://www.gov.uk/government/organisations/environment-agency' },
              { label: 'DEFRA UK-AIR', url: 'https://uk-air.defra.gov.uk/' },
              { label: 'Carbon Intensity API', url: 'https://carbonintensity.org.uk/' },
              { label: 'Brighton & Hove Council Environment', url: 'https://www.brighton-hove.gov.uk/environment' },
              { label: 'Sussex Wildlife Trust', url: 'https://sussexwildlifetrust.org.uk/' },
              { label: 'EA Bathing Water Quality', url: 'https://environment.data.gov.uk/bwq/profiles/' },
            ].map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-3 text-sm text-blue-600 hover:bg-accent transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data freshness */}
      {lastUpdated && (
        <p className="text-xs text-muted-foreground/70 text-center">
          Last updated: {lastUpdated}
        </p>
      )}
    </div>
  );
}
