export type HazardSource = 'flood' | 'air-quality' | 'carbon' | 'crime' | 'transport' | 'planning' | 'health' | 'housing' | 'schools' | 'community' | 'entertainment';
export type Severity = 'severe' | 'warning' | 'alert' | 'normal';

export interface HazardAlert {
  id: string;
  source: HazardSource;
  severity: Severity;
  title: string;
  description: string;
  location: { lat: number; lng: number };
  timestamp: string;
}

export interface StationReading {
  stationId: string;
  stationName: string;
  source: string;
  location: { lat: number; lng: number };
  parameter: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface CarbonIntensity {
  forecast: number;
  actual: number | null;
  index: string; // 'very low' | 'low' | 'moderate' | 'high' | 'very high'
  from: string;
  to: string;
  generationMix: GenerationMixEntry[];
}

export interface GenerationMixEntry {
  fuel: string;
  perc: number;
}

export interface FloodWarning {
  id: string;
  severity: Severity;
  severityLevel: number;
  title: string;
  description: string;
  area: string;
  timeRaised: string;
  timeUpdated: string;
}

export interface FloodStation {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  river: string;
  parameter: string;
  latestValue: number | null;
  unit: string;
  timestamp: string | null;
}

export interface AirQualityReading {
  stationId: string;
  stationName: string;
  location: { lat: number; lng: number };
  pollutants: PollutantReading[];
  overallIndex: number; // DAQI 1-10
  overallBand: string; // 'Low' | 'Moderate' | 'High' | 'Very High'
}

export interface PollutantReading {
  name: string;
  value: number | null;
  unit: string;
  index: number; // DAQI band 1-10
  band: string;
}

// Crime & Safety domain types
export interface CrimeIncident {
  id: string;
  category: string;
  location: { lat: number; lng: number };
  street: string;
  outcome: string | null;
  month: string; // YYYY-MM
  area: string; // BN1, BN2, BN3
}

export interface CrimeSummary {
  totalCrimes: number;
  month: string;
  categories: CrimeCategoryCount[];
  areaBreakdown: CrimeAreaCount[];
  outcomeBreakdown: CrimeOutcomeCount[];
  severity: Severity;
}

export interface CrimeCategoryCount {
  category: string;
  count: number;
}

export interface CrimeAreaCount {
  area: string;
  label: string;
  count: number;
}

export interface CrimeOutcomeCount {
  outcome: string;
  count: number;
}

export interface NeighbourhoodInfo {
  id: string;
  name: string;
  team: NeighbourhoodOfficer[];
  description: string;
  contactEmail: string | null;
  contactPhone: string | null;
}

export interface NeighbourhoodOfficer {
  name: string;
  rank: string;
  bio: string | null;
}

// Transport domain types
export interface TrainService {
  serviceId: string;
  operator: string;
  destination: string;
  scheduledTime: string;
  expectedTime: string | null;
  status: 'on-time' | 'delayed' | 'cancelled';
  platform: string | null;
  delayMinutes: number;
}

export interface TrainStationStatus {
  stationName: string;
  departures: TrainService[];
  arrivals: TrainService[];
  disruptions: string[];
  severity: Severity;
}

// Planning domain types
export interface PlanningApplication {
  id: string;
  reference: string;
  description: string;
  address: string;
  status: string;
  decisionDate: string | null;
  submissionDate: string;
  location: { lat: number; lng: number } | null;
  applicationType: string;
}

export interface PlanningOverview {
  totalApplications: number;
  recentApplications: PlanningApplication[];
  severity: Severity;
}

// Weather domain types
export interface WeatherCurrent {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  time: string;
}

export interface WeatherDaily {
  date: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipSum: number;
  precipProbability: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface WeatherHourly {
  time: string;
  temperature: number;
  precipProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
}

export interface WeatherOverview {
  current: WeatherCurrent;
  daily: WeatherDaily[];
  hourly: WeatherHourly[];
  severity: Severity;
}

// Bathing water domain types
export interface BeachWaterQuality {
  id: string;
  name: string;
  classification: string; // Excellent, Good, Sufficient, Poor
  sampleYear: number;
  lastSampleDate: string | null;
  severity: Severity;
}

export interface BathingWaterOverview {
  beaches: BeachWaterQuality[];
  severity: Severity;
}

// Health & NHS domain types
export interface HealthFacility {
  id: string;
  name: string;
  type: 'gp' | 'pharmacy' | 'hospital' | 'dental';
  address: string;
  postcode: string;
  phone: string | null;
  location: { lat: number; lng: number } | null;
}

export interface HealthOverview {
  facilities: HealthFacility[];
  counts: { gps: number; pharmacies: number; hospitals: number; dentists: number };
  severity: Severity;
}

// Housing & Property domain types
export interface PropertyPriceData {
  period: string;
  averagePrice: number;
  annualChangePercent: number;
}

export interface HousingOverview {
  current: PropertyPriceData;
  history: PropertyPriceData[];
  severity: Severity;
}

// Schools & Education domain types
export interface School {
  id: string;
  name: string;
  type: string;
  address: string;
  location: { lat: number; lng: number };
  operator: string | null;
  website: string | null;
}

export interface SchoolsOverview {
  schools: School[];
  totalCount: number;
  severity: Severity;
}

// Community & Food Banks domain types
export interface FoodBank {
  id: string;
  name: string;
  network: string | null;
  address: string;
  postcode: string;
  location: { lat: number; lng: number };
  phone: string | null;
  email: string | null;
  website: string | null;
  needs: string[];
  distance_m: number;
  hasNeeds: boolean;
}

export interface CommunityOverview {
  foodBanks: FoodBank[];
  totalBanks: number;
  banksWithNeeds: number;
  severity: Severity;
}

// Entertainment domain types
export type EventCategory = 'LIVE' | 'THEATRE' | 'COMEDY' | 'EXHIB' | 'ARTS' | 'CLUB' | 'FEST' | 'KIDS' | 'DATE' | 'BARPUB' | 'SPORT' | 'OTHER';

export interface EntertainmentEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  description: string;
  link: string;
  imageUrl: string | null;
  category: EventCategory;
  categoryLabel: string;
  venue: string;
  venueTown: string;
  location: { lat: number; lng: number } | null;
  entryPrice: string | null;
  doorsOpen: string | null;
  artists: string[];
}

export interface EntertainmentOverview {
  events: EntertainmentEvent[];
  totalCount: number;
  todayCount: number;
  thisWeekCount: number;
  severity: Severity;
}
