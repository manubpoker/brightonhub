'use client';

import { DashboardCard } from '@/components/shared/dashboard-card';
import { DASHBOARDS } from '@/lib/dashboards';
import { useCarbon } from '@/lib/hooks/use-carbon';
import { useFlood } from '@/lib/hooks/use-flood';
import { useAirQuality } from '@/lib/hooks/use-air-quality';
import { useCrime } from '@/lib/hooks/use-crime';
import { useTrains } from '@/lib/hooks/use-trains';
import { usePlanning } from '@/lib/hooks/use-planning';
import { useWeather } from '@/lib/hooks/use-weather';
import { useHealth } from '@/lib/hooks/use-health';
import { useHousing } from '@/lib/hooks/use-housing';
import { useSchools } from '@/lib/hooks/use-schools';
import { useCommunity } from '@/lib/hooks/use-community';
import { useEntertainment } from '@/lib/hooks/use-entertainment';
import { CARBON_INDEX_TO_SEVERITY } from '@/lib/constants';
import type { Severity } from '@/types/domain';
import { formatTimeAgo } from '@/lib/utils';
import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function useEnvironmentStatus() {
  const carbon = useCarbon();
  const flood = useFlood();
  const airQuality = useAirQuality();

  const severities: Severity[] = [];

  if (carbon.data) {
    severities.push(
      CARBON_INDEX_TO_SEVERITY[carbon.data.current.index.toLowerCase()] ?? 'normal'
    );
  }
  if (flood.data?.warnings?.length) {
    severities.push(flood.data.warnings[0].severity);
  }
  if (airQuality.data?.alert) {
    severities.push(airQuality.data.alert.severity);
  }

  const order: Record<Severity, number> = { severe: 0, warning: 1, alert: 2, normal: 3 };
  const worstSeverity = severities.length > 0
    ? severities.sort((a, b) => order[a] - order[b])[0]
    : 'normal';

  const parts: string[] = [];
  if (carbon.data) parts.push(`${carbon.data.current.forecast} gCO2/kWh`);
  if (flood.data) {
    const active = flood.data.warnings.filter((w) => w.severity !== 'normal').length;
    parts.push(active > 0 ? `${active} flood warning${active > 1 ? 's' : ''}` : 'No flood warnings');
  }
  if (airQuality.data?.reading) {
    parts.push(`Air: ${airQuality.data.reading.overallBand}`);
  }

  const timestamps = [carbon.dataUpdatedAt, flood.dataUpdatedAt, airQuality.dataUpdatedAt].filter(Boolean);
  const lastUpdated = timestamps.length > 0
    ? formatTimeAgo(new Date(Math.max(...timestamps)).toISOString())
    : null;

  return { severity: worstSeverity, summary: parts.join(' · ') || 'Loading...', lastUpdated };
}

function useCrimeStatus() {
  const crime = useCrime();

  if (!crime.data) return { severity: 'normal' as Severity, summary: 'Loading...', lastUpdated: null };

  return {
    severity: crime.data.summary.severity,
    summary: `${crime.data.summary.totalCrimes} crimes in ${crime.data.summary.month}`,
    lastUpdated: crime.dataUpdatedAt ? formatTimeAgo(new Date(crime.dataUpdatedAt).toISOString()) : null,
  };
}

function useTransportStatus() {
  const trains = useTrains();

  if (!trains.data) return { severity: 'normal' as Severity, summary: 'Loading...', lastUpdated: null };

  const delayed = trains.data.departures.filter((s) => s.status !== 'on-time').length;
  const total = trains.data.departures.length;
  const summary = total > 0
    ? delayed > 0
      ? `${delayed} of ${total} services disrupted`
      : `${total} services running on time`
    : 'No departures data';

  return {
    severity: trains.data.severity,
    summary,
    lastUpdated: trains.dataUpdatedAt ? formatTimeAgo(new Date(trains.dataUpdatedAt).toISOString()) : null,
  };
}

function usePlanningStatus() {
  const planning = usePlanning();

  if (!planning.data) return { severity: 'normal' as Severity, summary: 'Loading...', lastUpdated: null };

  return {
    severity: planning.data.severity,
    summary: `${planning.data.totalApplications} recent applications`,
    lastUpdated: planning.dataUpdatedAt ? formatTimeAgo(new Date(planning.dataUpdatedAt).toISOString()) : null,
  };
}

function useWeatherStatus() {
  const weather = useWeather();

  if (!weather.data) return { severity: 'normal' as Severity, summary: 'Loading...', lastUpdated: null };

  const { current, severity } = weather.data;
  const summary = `${current.temperature.toFixed(1)}°C — ${current.weatherDescription}`;

  return {
    severity,
    summary,
    lastUpdated: weather.dataUpdatedAt ? formatTimeAgo(new Date(weather.dataUpdatedAt).toISOString()) : null,
  };
}

function useHealthStatus() {
  const health = useHealth();

  if (!health.data) return { severity: 'normal' as Severity, summary: 'Loading...', lastUpdated: null };

  const { counts } = health.data;
  return {
    severity: 'normal' as Severity,
    summary: `${counts.gps} GPs, ${counts.pharmacies} pharmacies, ${counts.dentists} dentists`,
    lastUpdated: health.dataUpdatedAt ? formatTimeAgo(new Date(health.dataUpdatedAt).toISOString()) : null,
  };
}

function useHousingStatus() {
  const housing = useHousing();

  if (!housing.data) return { severity: 'normal' as Severity, summary: 'Loading...', lastUpdated: null };

  const { current, severity } = housing.data;
  const priceStr = current.averagePrice >= 1000
    ? `£${Math.round(current.averagePrice / 1000)}k`
    : `£${current.averagePrice}`;
  const change = current.annualChangePercent;

  return {
    severity,
    summary: `Avg ${priceStr}, ${change >= 0 ? '+' : ''}${change.toFixed(1)}% annual change`,
    lastUpdated: housing.dataUpdatedAt ? formatTimeAgo(new Date(housing.dataUpdatedAt).toISOString()) : null,
  };
}

function useSchoolsStatus() {
  const schools = useSchools();

  if (!schools.data) return { severity: 'normal' as Severity, summary: 'Loading...', lastUpdated: null };

  return {
    severity: 'normal' as Severity,
    summary: `${schools.data.totalCount} schools in Brighton & Hove`,
    lastUpdated: schools.dataUpdatedAt ? formatTimeAgo(new Date(schools.dataUpdatedAt).toISOString()) : null,
  };
}

function useCommunityStatus() {
  const community = useCommunity();

  if (!community.data) return { severity: 'normal' as Severity, summary: 'Loading...', lastUpdated: null };

  const { totalBanks, banksWithNeeds, severity } = community.data;
  const summary = banksWithNeeds > 0
    ? `${totalBanks} food banks, ${banksWithNeeds} with urgent needs`
    : `${totalBanks} food banks near Brighton`;

  return {
    severity,
    summary,
    lastUpdated: community.dataUpdatedAt ? formatTimeAgo(new Date(community.dataUpdatedAt).toISOString()) : null,
  };
}

function useEntertainmentStatus() {
  const entertainment = useEntertainment();

  if (!entertainment.data) return { severity: 'normal' as Severity, summary: 'Loading...', lastUpdated: null };

  const { todayCount, thisWeekCount } = entertainment.data;
  const summary = todayCount > 0
    ? `${todayCount} events today, ${thisWeekCount} this week`
    : `${thisWeekCount} events this week`;

  return {
    severity: 'normal' as Severity,
    summary,
    lastUpdated: entertainment.dataUpdatedAt ? formatTimeAgo(new Date(entertainment.dataUpdatedAt).toISOString()) : null,
  };
}

export default function PortalHomepage() {
  const envStatus = useEnvironmentStatus();
  const weatherStatus = useWeatherStatus();
  const crimeStatus = useCrimeStatus();
  const transportStatus = useTransportStatus();
  const planningStatus = usePlanningStatus();
  const healthStatus = useHealthStatus();
  const housingStatus = useHousingStatus();
  const schoolsStatus = useSchoolsStatus();
  const communityStatus = useCommunityStatus();
  const entertainmentStatus = useEntertainmentStatus();

  const statusMap: Record<string, { severity: Severity; summary: string; lastUpdated: string | null }> = {
    environment: envStatus,
    weather: weatherStatus,
    crime: crimeStatus,
    transport: transportStatus,
    planning: planningStatus,
    health: healthStatus,
    housing: housingStatus,
    schools: schoolsStatus,
    community: communityStatus,
    entertainment: entertainmentStatus,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">Brighton Hub</h1>
          <Badge variant="secondary" className="hidden sm:inline-flex">BN1</Badge>
        </div>
        <p className="text-gray-500 max-w-2xl">
          Real-time civic data for Brighton & Hove residents. Monitor environmental conditions, weather, crime, transport, planning, health services, housing, schools, and community support in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DASHBOARDS.map((config) => {
          const status = statusMap[config.id];
          return (
            <DashboardCard
              key={config.id}
              config={config}
              severity={status?.severity}
              summary={status?.summary}
              lastUpdated={status?.lastUpdated}
            />
          );
        })}
      </div>
    </div>
  );
}
