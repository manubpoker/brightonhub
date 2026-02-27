// Raw Carbon Intensity API response types
// The /regional/postcode/:postcode endpoint returns data as an array of regions,
// while /regional/intensity/.../fw24h/postcode/:postcode returns data as a single object.
export interface CarbonRegionData {
  regionid: number;
  shortname: string;
  postcode: string;
  data: Array<{
    from: string;
    to: string;
    intensity: {
      forecast: number;
      index: string;
    };
    generationmix: Array<{
      fuel: string;
      perc: number;
    }>;
  }>;
}

export interface CarbonIntensityResponse {
  data: CarbonRegionData | CarbonRegionData[];
}

// Raw EA Flood Monitoring API response types
export interface FloodWarningsResponse {
  items: Array<{
    '@id': string;
    description: string;
    eaAreaName: string;
    eaRegionName: string;
    floodArea: {
      county: string;
      notation: string;
      polygon: string;
      riverOrSea: string;
    };
    floodAreaID: string;
    isTidal: boolean;
    message: string;
    severity: string;
    severityLevel: number;
    timeMessageChanged: string;
    timeRaised: string;
    timeSeverityChanged: string;
  }>;
}

export interface FloodStationsResponse {
  items: Array<{
    '@id': string;
    RLOIid: string;
    catchmentName: string;
    label: string;
    lat: number;
    long: number;
    measures: Array<{
      '@id': string;
      parameter: string;
      parameterName: string;
      period: number;
      qualifier: string;
      unitName: string;
      latestReading?: {
        '@id': string;
        date: string;
        dateTime: string;
        measure: string;
        value: number;
      };
    }> | {
      '@id': string;
      parameter: string;
      parameterName: string;
      period: number;
      qualifier: string;
      unitName: string;
      latestReading?: {
        '@id': string;
        date: string;
        dateTime: string;
        measure: string;
        value: number;
      };
    };
    riverName: string;
    stageScale?: {
      highestRecent: { '@id': string; dateTime: string; value: number };
      maxOnRecord: { '@id': string; dateTime: string; value: number };
      scaleMax: number;
      typicalRangeHigh: number;
      typicalRangeLow: number;
    };
    stationReference: string;
    status: string;
    town: string;
  }>;
}

// Raw UK-AIR API response types
export interface UKAirStationsResponse {
  id: number;
  label: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    id: number;
    label: string;
  };
}

export interface UKAirTimeseriesResponse {
  id: number;
  label: string;
  uom: string;
  station: {
    properties: {
      id: number;
      label: string;
    };
    geometry: {
      coordinates: number[];
    };
  };
  lastValue?: {
    timestamp: number;
    value: number;
  };
  parameters?: {
    phenomenon?: {
      id: number;
      label: string;
    };
  };
}

// Police.uk Crime API response types
export interface PoliceUkCrimeResponse {
  category: string;
  location_type: string;
  location: {
    latitude: string;
    longitude: string;
    street: {
      id: number;
      name: string;
    };
  };
  context: string;
  outcome_status: {
    category: string;
    date: string;
  } | null;
  persistent_id: string;
  id: number;
  location_subtype: string;
  month: string;
}

export interface PoliceUkNeighbourhoodResponse {
  id: string;
  name: string;
}

export interface PoliceUkNeighbourhoodDetailResponse {
  id: string;
  name: string;
  description: string;
  contact_details: {
    email?: string;
    telephone?: string;
  };
  centre: {
    latitude: string;
    longitude: string;
  };
}

export interface PoliceUkOfficerResponse {
  name: string;
  rank: string;
  bio: string | null;
}

// National Rail Darwin Lite response types (parsed from XML)
export interface DarwinServiceResponse {
  serviceID: string;
  operatorCode: string;
  operator: string;
  destination: string;
  std?: string; // scheduled time of departure
  etd?: string; // estimated time of departure
  sta?: string; // scheduled time of arrival
  eta?: string; // estimated time of arrival
  platform?: string;
  isCancelled?: boolean;
}

export interface DarwinStationBoardResponse {
  locationName: string;
  trainServices: DarwinServiceResponse[];
  nrccMessages?: string[];
}

// Planning Data API response types (entity.json endpoint)
export interface PlanningDataResponse {
  entities: Array<{
    'entry-date': string;
    'start-date': string;
    'end-date': string;
    entity: number;
    name: string;
    dataset: string;
    typology: string;
    reference: string;
    prefix: string;
    'organisation-entity': string;
    geometry: string;
    point: string; // WKT POINT(lng lat) or empty
    quality: string;
    description: string;
    'decision-date'?: string;
  }>;
  links: Record<string, string>;
  count: number;
}

// NHS ODS API response types
export interface NhsOdsOrganisation {
  Name: string;
  OrgId: string;
  Status: string;
  OrgRecordClass: string;
  PostCode: string;
  LastChangeDate: string;
  PrimaryRoleId: string;
  PrimaryRoleDescription: string;
  OrgLink: string;
}

export interface NhsOdsSearchResponse {
  Organisations: NhsOdsOrganisation[];
}

// Land Registry SPARQL response types
export interface LandRegistrySparqlResponse {
  results: {
    bindings: Array<{
      period: { value: string };
      averagePrice: { value: string };
      annualChange?: { value: string };
    }>;
  };
}

// Overpass API response types
export interface OverpassResponse {
  elements: Array<{
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string>;
  }>;
}

// GiveFood API response types
export interface GiveFoodFoodBank {
  name: string;
  slug: string;
  address: string;
  postcode: string;
  lat_lng: string;
  phone: string | null;
  email: string | null;
  url: string | null;
  network: string;
  needs: {
    needs: string;
  };
  distance_m: number;
  distance_mi: number;
}

// Skiddle Events API response types
export interface SkiddleEvent {
  id: number;
  eventname: string;
  date: string; // YYYY-MM-DD
  description: string;
  link: string;
  largeimageurl: string;
  imageurl?: string;
  EventCode: string;
  entryprice: string;
  openingtimes?: { doorsopen?: string; doorsclose?: string; lastentry?: string };
  venue: {
    id: number;
    name: string;
    town: string;
    address: string;
    postcode: string;
    latitude: number;
    longitude: number;
  };
  artists?: Array<{ artistname: string }>;
  genre?: { genreid: number; name: string };
  startdate?: string;
  enddate?: string;
}

export interface SkiddleSearchResponse {
  results: SkiddleEvent[];
  totalcount: number;
  pagecount: number;
}

// Open-Meteo API response types
export interface OpenMeteoResponse {
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

// EA Bathing Water API response types (Linked Data API format)
export interface BathingWaterProfileResponse {
  format: string;
  version: string;
  result: {
    primaryTopic: {
      '@id': string;
      name: { _value: string };
      samplingPoint?: {
        lat: number;
        long: number;
      };
      latestComplianceAssessment?: {
        _about: string; // contains year in URL path
        complianceClassification: {
          '@id': string;
          name: { _value: string }; // Excellent, Good, Sufficient, Poor
        };
      };
      latestSampleAssessment?: {
        _about: string; // contains date in URL path
      };
      latestRiskPrediction?: {
        riskLevel: {
          name: { _value: string };
        };
      };
      waterQualityImpactedByHeavyRain?: boolean;
    };
  };
}
