'use client';

import { WeatherBar } from '@/components/homepage/weather-bar';
import { AlertBanner } from '@/components/homepage/alert-banner';
import { WeatherCard } from '@/components/homepage/weather-card';
import { EnvironmentCard } from '@/components/homepage/environment-card';
import { CrimeCard } from '@/components/homepage/crime-card';
import { HousingCard } from '@/components/homepage/housing-card';
import { HealthCard } from '@/components/homepage/health-card';
import { EventsCard } from '@/components/homepage/events-card';
import { SchoolsCard } from '@/components/homepage/schools-card';
import { TransportCard } from '@/components/homepage/transport-card';
import { CommunityCard } from '@/components/homepage/community-card';
import { TodaySnapshot } from '@/components/homepage/today-snapshot';

export default function PortalHomepage() {
  return (
    <>
      {/* Full-width sections */}
      <WeatherBar />
      <AlertBanner />
      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <TodaySnapshot />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Brighton Hub</h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            Live civic data for Brighton &amp; Hove: environment, transport, crime, housing, health, and community support in one place.
          </p>
        </div>

        {/* Card grid */}
        {/* Row 1: Weather + Environment (hero) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
          <WeatherCard />
          <EnvironmentCard />
        </div>

        {/* Row 2: Crime + Housing (reliable data) */}
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

        {/* Row 4: Transport + Community (limited data) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TransportCard />
          <CommunityCard />
        </div>
      </section>
    </>
  );
}
