import type { OpenMeteoResponse } from '@/types/api';
import type { WeatherCurrent, WeatherDaily, WeatherHourly, WeatherOverview, HazardAlert, Severity } from '@/types/domain';
import { BRIGHTON_LAT, BRIGHTON_LNG, WMO_WEATHER_CODES } from '@/lib/constants';

export type WeatherData = WeatherOverview;

function getWeatherDescription(code: number): string {
  return WMO_WEATHER_CODES[code]?.description ?? 'Unknown';
}

function getWeatherSeverity(current: WeatherCurrent, daily: WeatherDaily[]): Severity {
  // Severe: thunderstorm, heavy rain/snow, extreme wind
  if (current.weatherCode >= 95 || current.windGusts > 80) return 'severe';
  // Warning: heavy rain, moderate snow, strong wind
  if (current.weatherCode >= 65 || current.windGusts > 60 || current.precipitation > 10) return 'warning';
  // Alert: moderate rain, fog, gusty
  if (current.weatherCode >= 51 || current.windGusts > 40) return 'alert';

  // Check upcoming day for severe weather
  const tomorrow = daily[1];
  if (tomorrow) {
    if (tomorrow.weatherCode >= 95 || tomorrow.windSpeedMax > 60) return 'alert';
  }

  return 'normal';
}

export function transformWeatherResponse(raw: OpenMeteoResponse): WeatherData {
  const current: WeatherCurrent = {
    temperature: raw.current.temperature_2m,
    apparentTemperature: raw.current.apparent_temperature,
    humidity: raw.current.relative_humidity_2m,
    precipitation: raw.current.precipitation,
    weatherCode: raw.current.weather_code,
    weatherDescription: getWeatherDescription(raw.current.weather_code),
    windSpeed: raw.current.wind_speed_10m,
    windDirection: raw.current.wind_direction_10m,
    windGusts: raw.current.wind_gusts_10m,
    time: raw.current.time,
  };

  const daily: WeatherDaily[] = raw.daily.time.map((date, i) => ({
    date,
    weatherCode: raw.daily.weather_code[i],
    weatherDescription: getWeatherDescription(raw.daily.weather_code[i]),
    tempMax: raw.daily.temperature_2m_max[i],
    tempMin: raw.daily.temperature_2m_min[i],
    precipSum: raw.daily.precipitation_sum[i],
    precipProbability: raw.daily.precipitation_probability_max[i],
    windSpeedMax: raw.daily.wind_speed_10m_max[i],
    sunrise: raw.daily.sunrise[i],
    sunset: raw.daily.sunset[i],
    uvIndexMax: raw.daily.uv_index_max[i],
  }));

  const hourly: WeatherHourly[] = raw.hourly.time.map((time, i) => ({
    time,
    temperature: raw.hourly.temperature_2m[i],
    precipProbability: raw.hourly.precipitation_probability[i],
    precipitation: raw.hourly.precipitation[i],
    weatherCode: raw.hourly.weather_code[i],
    windSpeed: raw.hourly.wind_speed_10m[i],
  }));

  const severity = getWeatherSeverity(current, daily);

  return { current, daily, hourly, severity };
}

export function createWeatherAlert(data: WeatherData): HazardAlert {
  return {
    id: 'weather-current',
    source: 'planning', // reuse existing source type — weather is informational
    severity: data.severity,
    title: `${data.current.temperature.toFixed(0)}°C — ${data.current.weatherDescription}`,
    description: `Wind: ${data.current.windSpeed.toFixed(0)} km/h, Humidity: ${data.current.humidity}%`,
    location: { lat: BRIGHTON_LAT, lng: BRIGHTON_LNG },
    timestamp: data.current.time,
  };
}
