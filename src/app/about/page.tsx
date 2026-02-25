import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Activity, Waves, Wind, Zap, Shield, Train, Landmark, CloudSun, Droplets, ExternalLink, Scale } from 'lucide-react';

const dataSources = [
  {
    name: 'National Grid ESO Carbon Intensity API',
    icon: Zap,
    description:
      'Provides real-time and forecast carbon intensity data for Great Britain\'s electricity grid, broken down by region and generation source.',
    url: 'https://carbonintensity.org.uk/',
    updates: 'Every 30 minutes',
    licence: 'CC BY 4.0',
  },
  {
    name: 'Environment Agency Flood Monitoring API',
    icon: Waves,
    description:
      'Real-time flood warnings, river/sea levels, and rainfall data from over 4,000 monitoring stations across England.',
    url: 'https://environment.data.gov.uk/flood-monitoring/doc/reference',
    updates: 'Every 15 minutes',
    licence: 'Open Government Licence v3.0',
  },
  {
    name: 'DEFRA UK-AIR (Air Quality)',
    icon: Wind,
    description:
      'UK Air Information Resource providing hourly pollutant concentrations from the Automatic Urban and Rural Network (AURN) of monitoring stations.',
    url: 'https://uk-air.defra.gov.uk/',
    updates: 'Hourly',
    licence: 'Open Government Licence v3.0',
  },
  {
    name: 'Police.uk Crime Data API',
    icon: Shield,
    description:
      'Street-level crime, outcome, and neighbourhood data for all police forces in England, Wales, and Northern Ireland.',
    url: 'https://data.police.uk/',
    updates: 'Monthly',
    licence: 'Open Government Licence v3.0',
  },
  {
    name: 'National Rail Darwin API',
    icon: Train,
    description:
      'Live departure boards, service disruption alerts, and train running information from the National Rail network.',
    url: 'https://www.nationalrail.co.uk/100296.aspx',
    updates: 'Real-time',
    licence: 'National Rail',
  },
  {
    name: 'Planning Data (DLUHC)',
    icon: Landmark,
    description:
      'Planning application data from the Department for Levelling Up, Housing and Communities. Currently in beta.',
    url: 'https://www.planning.data.gov.uk/',
    updates: 'Varies',
    licence: 'Open Government Licence v3.0',
  },
  {
    name: 'Open-Meteo Weather API',
    icon: CloudSun,
    description:
      'Free weather API providing current conditions, hourly and 7-day forecasts using Met Office and ECMWF models. No API key required.',
    url: 'https://open-meteo.com/',
    updates: 'Every 30 minutes',
    licence: 'CC BY 4.0',
  },
  {
    name: 'Environment Agency Bathing Water Quality',
    icon: Droplets,
    description:
      'Annual bathing water classifications and sample results for Brighton & Hove beaches, based on E. coli and intestinal enterococci testing.',
    url: 'https://environment.data.gov.uk/bwq/profiles/',
    updates: 'Seasonal (May–September)',
    licence: 'Open Government Licence v3.0',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-green-600" />
          About Brighton Hub
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          A multi-dashboard civic platform that combines environmental monitoring, weather, crime data,
          transport, planning, health, housing, schools, community resources, events, and a student hub
          into a single view for Brighton &amp; Hove residents.
        </p>
      </div>

      {/* Why this exists */}
      <Card>
        <CardHeader>
          <CardTitle>Why This Platform?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>
            Brighton &amp; Hove faces simultaneous civic challenges — coastal flooding, air quality concerns,
            crime patterns, transport disruptions, and rapid development — all monitored
            by separate agencies with <strong>no coordinated dashboard</strong>.
          </p>
          <p>
            This platform brings together open data from multiple public APIs into one accessible
            portal, alongside curated local resources like the Student Hub, letting residents and
            students see the full picture of what&apos;s happening in their city.
          </p>
        </CardContent>
      </Card>

      {/* Data sources */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Data Sources</h2>
        <div className="space-y-4">
          {dataSources.map((source) => {
            const Icon = source.icon;
            return (
              <Card key={source.name}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Icon className="h-8 w-8 text-gray-400 shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{source.name}</h3>
                        <Badge variant="secondary">{source.updates}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {source.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <a
                          href={source.url}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Documentation
                        </a>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Scale className="h-3.5 w-3.5" />
                          {source.licence}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Legal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Licencing & Attribution</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>
            This platform contains public sector information licensed under the{' '}
            <a
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              className="underline hover:text-gray-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Government Licence v3.0
            </a>
            .
          </p>
          <p>
            Carbon intensity data is provided by National Grid ESO under{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="underline hover:text-gray-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creative Commons Attribution 4.0
            </a>
            .
          </p>
          <p>
            Map tiles are provided by{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              className="underline hover:text-gray-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStreetMap
            </a>{' '}
            contributors.
          </p>
        </CardContent>
      </Card>

      {/* Tech stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Technology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'Next.js 16',
              'TypeScript',
              'Tailwind CSS',
              'shadcn/ui',
              'Leaflet',
              'Recharts',
              'TanStack Query',
              'fast-xml-parser',
            ].map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
