'use client';

import { WeatherBar } from '@/components/homepage/weather-bar';
import { AlertBanner } from '@/components/homepage/alert-banner';
import { TransportCard } from '@/components/homepage/transport-card';
import { EnvironmentCard } from '@/components/homepage/environment-card';
import { CrimeCard } from '@/components/homepage/crime-card';
import { HousingCard } from '@/components/homepage/housing-card';
import { HealthCard } from '@/components/homepage/health-card';
import { EventsCard } from '@/components/homepage/events-card';
import { SchoolsCard } from '@/components/homepage/schools-card';

export default function PortalHomepage() {
  return (
    <>
      {/* Full-width sections */}
      <WeatherBar />
      <AlertBanner />

      {/* Card grid */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
        {/* Row 1: Transport + Environment */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
          <TransportCard />
          <EnvironmentCard />
        </div>

        {/* Row 2: Crime + Housing */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
          <CrimeCard />
          <HousingCard />
        </div>

        {/* Row 3: Health + Events + Schools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HealthCard />
          <EventsCard />
          <SchoolsCard />
        </div>
      </div>
    </>
  );
}
