'use client';

import { Waves, Wind, Zap } from 'lucide-react';
import { StatusCard } from '@/components/shared/status-card';
import { useCarbon } from '@/lib/hooks/use-carbon';
import { useFlood } from '@/lib/hooks/use-flood';
import { useAirQuality } from '@/lib/hooks/use-air-quality';
import { CARBON_INDEX_TO_SEVERITY } from '@/lib/constants';
import type { Severity } from '@/types/domain';

export function EnvStatusSummary() {
  const carbon = useCarbon();
  const flood = useFlood();
  const airQuality = useAirQuality();

  // Derive flood severity from active warnings
  const floodSeverity: Severity = flood.data?.warnings?.length
    ? flood.data.warnings[0].severity
    : 'normal';

  const floodValue = flood.data?.warnings?.length
    ? `${flood.data.warnings.length} Warning${flood.data.warnings.length > 1 ? 's' : ''}`
    : 'Normal';

  const floodSubtitle = flood.data?.warnings?.length
    ? `Highest: ${flood.data.warnings[0].title}`
    : 'No active flood warnings';

  // Derive air quality severity
  const aqSeverity: Severity = airQuality.data?.alert?.severity ?? 'normal';
  const aqValue = airQuality.data
    ? `${airQuality.data.reading?.overallBand ?? 'Good'}`
    : 'Good';
  const aqSubtitle = airQuality.data?.reading
    ? `DAQI: ${airQuality.data.reading.overallIndex}/10`
    : 'Air quality monitoring';

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
      <StatusCard
        title="Carbon Intensity"
        icon={Zap}
        severity={
          carbon.data
            ? (CARBON_INDEX_TO_SEVERITY[
                carbon.data.current.index.toLowerCase()
              ] ?? 'normal')
            : 'normal'
        }
        value={
          carbon.data
            ? `${carbon.data.current.forecast} gCO2/kWh`
            : 'Loading...'
        }
        subtitle={
          carbon.data
            ? `Index: ${carbon.data.current.index}`
            : 'Fetching data...'
        }
        loading={carbon.isLoading}
        error={carbon.isError}
      />
      <StatusCard
        title="Flood Risk"
        icon={Waves}
        severity={floodSeverity}
        value={floodValue}
        subtitle={floodSubtitle}
        loading={flood.isLoading}
        error={flood.isError}
      />
      <StatusCard
        title="Air Quality"
        icon={Wind}
        severity={aqSeverity}
        value={aqValue}
        subtitle={aqSubtitle}
        loading={airQuality.isLoading}
        error={airQuality.isError}
      />
    </div>
  );
}
