// Brighton coordinates
export const BRIGHTON_LAT = 50.8225;
export const BRIGHTON_LNG = -0.1372;
export const BRIGHTON_POSTCODE = 'BN1';

// Map defaults
export const MAP_DEFAULT_ZOOM = 12;
export const FLOOD_STATION_RADIUS_KM = 25;

// Brighton & Hove urban area postcodes
export const BRIGHTON_POSTCODES = ['BN1', 'BN2', 'BN3', 'BN41', 'BN42', 'BN43'] as const;

// Brighton & Hove wider bounding box (includes Shoreham/Portslade)
export const BRIGHTON_BBOX = {
  south: 50.79,
  west: -0.32,
  north: 50.87,
  east: -0.05,
} as const;

// Crime area coordinates: central points for each BN postcode area
export const CRIME_AREAS = [
  { id: 'BN1', label: 'BN1 — Central Brighton', lat: 50.8290, lng: -0.1425 },
  { id: 'BN2', label: 'BN2 — East Brighton & Kemptown', lat: 50.8230, lng: -0.1100 },
  { id: 'BN3', label: 'BN3 — Hove', lat: 50.8340, lng: -0.1800 },
  { id: 'BN41', label: 'BN41 — Southwick & Fishersgate', lat: 50.8360, lng: -0.2280 },
  { id: 'BN42', label: 'BN42 — Shoreham-by-Sea (West)', lat: 50.8330, lng: -0.2700 },
  { id: 'BN43', label: 'BN43 — Shoreham-by-Sea (East)', lat: 50.8350, lng: -0.2900 },
] as const;

// API URLs (upstream)
export const CARBON_API_URL = 'https://api.carbonintensity.org.uk';
export const FLOOD_API_URL = 'https://environment.data.gov.uk/flood-monitoring';
export const UKAIR_API_URL = 'https://uk-air.defra.gov.uk/sos-ukair/api/v1';
export const POLICE_API_URL = 'https://data.police.uk/api';
export const PLANNING_API_URL = 'https://www.planning.data.gov.uk';
export const OPENMETEO_API_URL = 'https://api.open-meteo.com/v1';
export const BATHING_WATER_API_URL = 'https://environment.data.gov.uk/doc/bathing-water';
export const NHS_ODS_API_URL = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations';
export const LAND_REGISTRY_API_URL = 'http://landregistry.data.gov.uk/landregistry/query';
export const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
export const GIVEFOOD_API_URL = 'https://www.givefood.org.uk/api/2/foodbanks/search/';
export const POSTCODES_IO_API_URL = 'https://api.postcodes.io/postcodes';
export const SKIDDLE_API_URL = 'https://www.skiddle.com/api/v1/events/search/';
export const SKIDDLE_API_KEY = process.env.SKIDDLE_API_KEY ?? '';

// Brighton station CRS code for National Rail
export const BRIGHTON_STATION_CRS = 'BTN';

// Brighton TIPLOC for Push Port filtering
export const BRIGHTON_TIPLOC = 'BRGHTN';

// Darwin Push Port connection settings (Kafka via RDM / Confluent Cloud)
export const DARWIN_PUSHPORT_BROKER = process.env.DARWIN_PUSHPORT_BROKER ?? '';
export const DARWIN_PUSHPORT_USER = process.env.DARWIN_PUSHPORT_USER ?? '';
export const DARWIN_PUSHPORT_PASS = process.env.DARWIN_PUSHPORT_PASS ?? '';
export const DARWIN_PUSHPORT_TOPIC = process.env.DARWIN_PUSHPORT_TOPIC ?? '';
export const DARWIN_PUSHPORT_GROUP = process.env.DARWIN_PUSHPORT_GROUP ?? '';

// Brighton & Hove local authority organisation entity for planning data
export const BRIGHTON_ORG_ENTITY = '49';

// Brighton beaches for bathing water quality
export const BRIGHTON_BEACHES = [
  { id: 'ukj2100-14950', name: 'Brighton Central', lat: 50.8190, lng: -0.1380 },
  { id: 'ukj2100-14900', name: 'Brighton Kemptown', lat: 50.8180, lng: -0.1200 },
  { id: 'ukj2100-15000', name: 'Hove', lat: 50.8280, lng: -0.1750 },
] as const;

// Internal API routes
export const API_ROUTES = {
  carbon: '/api/carbon',
  flood: '/api/flood',
  floodStations: '/api/flood/stations',
  airQuality: '/api/air-quality',
  crime: '/api/crime',
  crimeNeighbourhood: '/api/crime/neighbourhood',
  trains: '/api/transport/trains',
  planningApplications: '/api/planning/applications',
  weather: '/api/weather',
  bathingWater: '/api/bathing-water',
  health: '/api/health',
  housing: '/api/housing',
  schools: '/api/schools',
  community: '/api/community',
  entertainment: '/api/entertainment',
} as const;

// Polling intervals (ms)
export const POLLING = {
  carbon: 30 * 60 * 1000,      // 30 minutes
  flood: 15 * 60 * 1000,       // 15 minutes
  airQuality: 60 * 60 * 1000,  // 1 hour
  crime: 60 * 60 * 1000,       // 1 hour (monthly data, doesn't change often)
  trains: 60 * 1000,           // 1 minute (live departures)
  planning: 60 * 60 * 1000,    // 1 hour
  weather: 30 * 60 * 1000,     // 30 minutes
  bathingWater: 6 * 60 * 60 * 1000, // 6 hours
  health: 6 * 60 * 60 * 1000,      // 6 hours
  housing: 24 * 60 * 60 * 1000,    // 24 hours
  schools: 24 * 60 * 60 * 1000,    // 24 hours
  community: 60 * 60 * 1000,       // 1 hour
  entertainment: 60 * 60 * 1000,   // 1 hour
} as const;

// Severity colors
export const SEVERITY_COLORS = {
  normal: '#22c55e',
  alert: '#eab308',
  warning: '#f97316',
  severe: '#ef4444',
} as const;

// Severity Tailwind classes
export const SEVERITY_BG_CLASSES = {
  normal: 'bg-green-500',
  alert: 'bg-yellow-500',
  warning: 'bg-orange-500',
  severe: 'bg-red-500',
} as const;

export const SEVERITY_TEXT_CLASSES = {
  normal: 'text-green-600',
  alert: 'text-yellow-600',
  warning: 'text-orange-600',
  severe: 'text-red-600',
} as const;

export const SEVERITY_BORDER_CLASSES = {
  normal: 'border-green-500',
  alert: 'border-yellow-500',
  warning: 'border-orange-500',
  severe: 'border-red-500',
} as const;

// Carbon intensity index to severity mapping
export const CARBON_INDEX_TO_SEVERITY: Record<string, 'normal' | 'alert' | 'warning' | 'severe'> = {
  'very low': 'normal',
  'low': 'normal',
  'moderate': 'alert',
  'high': 'warning',
  'very high': 'severe',
};

// DAQI (Daily Air Quality Index) bands
export const DAQI_BANDS = [
  { min: 1, max: 3, band: 'Low', severity: 'normal' as const },
  { min: 4, max: 6, band: 'Moderate', severity: 'alert' as const },
  { min: 7, max: 9, band: 'High', severity: 'warning' as const },
  { min: 10, max: 10, band: 'Very High', severity: 'severe' as const },
];

// Flood severity level mapping (EA uses 1=severe, 4=no longer in force)
export const FLOOD_SEVERITY_MAP: Record<number, 'severe' | 'warning' | 'alert' | 'normal'> = {
  1: 'severe',
  2: 'warning',
  3: 'alert',
  4: 'normal',
};

// Crime severity thresholds — per-area counts
// Brighton typically sees ~1000-1500 crimes per BN area per month
export const CRIME_SEVERITY_THRESHOLDS = {
  normal: 3500,
  alert: 4500,
  warning: 5500,
  // above 5500 total across all areas = severe
} as const;

// Transport severity mapping: percentage of disrupted services
export const TRANSPORT_SEVERITY_THRESHOLDS = {
  normal: 0,     // 0% disrupted
  alert: 0.2,    // 1-20% disrupted
  warning: 0.5,  // 20-50% disrupted
  // above 50% = severe
} as const;

// Map marker colors for all data types
export const MARKER_COLORS: Record<string, string> = {
  flood: '#3b82f6',         // blue
  'air-quality': '#8b5cf6', // purple
  carbon: '#22c55e',        // green
  crime: '#ef4444',         // red
  'crime-BN1': '#ef4444',   // red
  'crime-BN2': '#f97316',   // orange
  'crime-BN3': '#8b5cf6',   // purple
  'crime-BN41': '#06b6d4',  // cyan
  'crime-BN42': '#d946ef',  // fuchsia
  'crime-BN43': '#84cc16',  // lime
  transport: '#f59e0b',     // amber
  planning: '#6366f1',      // indigo
  weather: '#0ea5e9',       // sky
  beach: '#06b6d4',         // cyan
  health: '#db2777',        // pink
  housing: '#0d9488',       // teal
  schools: '#7c3aed',       // violet
  community: '#059669',     // emerald
  'health-gp': '#ec4899',      // pink
  'health-pharmacy': '#22c55e', // green
  'health-hospital': '#3b82f6', // blue
  'health-dental': '#a855f7',   // purple
  entertainment: '#f43f5e',    // rose
};

// Friendly crime category labels
export const CRIME_CATEGORY_LABELS: Record<string, string> = {
  'anti-social-behaviour': 'Anti-social Behaviour',
  'bicycle-theft': 'Bicycle Theft',
  'burglary': 'Burglary',
  'criminal-damage-arson': 'Criminal Damage & Arson',
  'drugs': 'Drugs',
  'other-crime': 'Other Crime',
  'other-theft': 'Other Theft',
  'possession-of-weapons': 'Possession of Weapons',
  'public-order': 'Public Order',
  'robbery': 'Robbery',
  'shoplifting': 'Shoplifting',
  'theft-from-the-person': 'Theft from Person',
  'vehicle-crime': 'Vehicle Crime',
  'violent-crime': 'Violent Crime',
};

// Weather condition code descriptions (WMO codes)
export const WMO_WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: 'sun' },
  1: { description: 'Mainly clear', icon: 'sun' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Foggy', icon: 'cloud-fog' },
  48: { description: 'Depositing rime fog', icon: 'cloud-fog' },
  51: { description: 'Light drizzle', icon: 'cloud-drizzle' },
  53: { description: 'Moderate drizzle', icon: 'cloud-drizzle' },
  55: { description: 'Dense drizzle', icon: 'cloud-drizzle' },
  61: { description: 'Slight rain', icon: 'cloud-rain' },
  63: { description: 'Moderate rain', icon: 'cloud-rain' },
  65: { description: 'Heavy rain', icon: 'cloud-rain' },
  71: { description: 'Slight snow', icon: 'snowflake' },
  73: { description: 'Moderate snow', icon: 'snowflake' },
  75: { description: 'Heavy snow', icon: 'snowflake' },
  80: { description: 'Slight rain showers', icon: 'cloud-rain' },
  81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
  82: { description: 'Violent rain showers', icon: 'cloud-rain' },
  95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { description: 'Thunderstorm with hail', icon: 'cloud-lightning' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
};
