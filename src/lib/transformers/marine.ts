import type { OpenMeteoMarineResponse } from '@/types/api';
import type { MarineCurrent, MarineHourly, MarineDaily, MarineOverview, Severity } from '@/types/domain';

export type MarineData = MarineOverview;

function getMarineSeverity(current: MarineCurrent): Severity {
  // Wave height thresholds for English Channel near Brighton
  if (current.waveHeight >= 4.0 || current.swellHeight >= 3.0) return 'severe';
  if (current.waveHeight >= 2.5 || current.swellHeight >= 2.0) return 'warning';
  if (current.waveHeight >= 1.5 || current.swellHeight >= 1.0) return 'alert';
  return 'normal';
}

export function transformMarineResponse(raw: OpenMeteoMarineResponse): MarineData {
  const current: MarineCurrent = {
    waveHeight: raw.current.wave_height,
    waveDirection: raw.current.wave_direction,
    wavePeriod: raw.current.wave_period,
    swellHeight: raw.current.swell_wave_height,
    swellDirection: raw.current.swell_wave_direction,
    swellPeriod: raw.current.swell_wave_period,
    time: raw.current.time,
  };

  const hourly: MarineHourly[] = raw.hourly.time.map((time, i) => ({
    time,
    waveHeight: raw.hourly.wave_height[i],
    waveDirection: raw.hourly.wave_direction[i],
    wavePeriod: raw.hourly.wave_period[i],
    swellHeight: raw.hourly.swell_wave_height[i],
  }));

  const daily: MarineDaily[] = raw.daily.time.map((date, i) => ({
    date,
    waveHeightMax: raw.daily.wave_height_max[i],
    waveDirectionDominant: raw.daily.wave_direction_dominant[i],
    wavePeriodMax: raw.daily.wave_period_max[i],
    swellHeightMax: raw.daily.swell_wave_height_max[i],
  }));

  const severity = getMarineSeverity(current);

  return { current, hourly, daily, severity };
}
