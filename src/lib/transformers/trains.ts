import type { DarwinStationBoardResponse, DarwinServiceResponse } from '@/types/api';
import type { TrainService, TrainStationStatus, Severity } from '@/types/domain';
import { TRANSPORT_SEVERITY_THRESHOLDS } from '@/lib/constants';

export type TrainData = TrainStationStatus;

function parseService(raw: DarwinServiceResponse, direction: 'departure' | 'arrival'): TrainService {
  const scheduled = direction === 'departure' ? (raw.std ?? '') : (raw.sta ?? '');
  const expected = direction === 'departure' ? (raw.etd ?? null) : (raw.eta ?? null);

  let status: 'on-time' | 'delayed' | 'cancelled' = 'on-time';
  let delayMinutes = 0;

  if (raw.isCancelled) {
    status = 'cancelled';
    delayMinutes = -1;
  } else if (expected && expected !== 'On time' && expected !== scheduled) {
    // Try to parse delay from "HH:MM" format
    if (/^\d{2}:\d{2}$/.test(expected) && /^\d{2}:\d{2}$/.test(scheduled)) {
      const [eH, eM] = expected.split(':').map(Number);
      const [sH, sM] = scheduled.split(':').map(Number);
      delayMinutes = (eH * 60 + eM) - (sH * 60 + sM);
      // Handle midnight wraparound (only for genuine delays, not early trains)
      if (delayMinutes < -720) delayMinutes += 1440;
      if (delayMinutes > 720) delayMinutes -= 1440;
    }
    // Only mark as delayed if actually late (not early)
    if (delayMinutes > 0) {
      status = 'delayed';
    }
  }

  return {
    serviceId: raw.serviceID,
    operator: raw.operator || raw.operatorCode || '',
    destination: raw.destination,
    scheduledTime: scheduled,
    expectedTime: expected,
    status,
    platform: raw.platform ?? null,
    delayMinutes,
  };
}

function getTransportSeverity(services: TrainService[]): Severity {
  if (services.length === 0) return 'normal';
  const disrupted = services.filter((s) => s.status !== 'on-time').length;
  // Need at least 3 services to get meaningful severity; with fewer, cap at 'alert'
  if (services.length < 3) {
    return disrupted > 0 ? 'alert' : 'normal';
  }
  const ratio = disrupted / services.length;

  if (ratio > TRANSPORT_SEVERITY_THRESHOLDS.warning) return 'severe';
  if (ratio > TRANSPORT_SEVERITY_THRESHOLDS.alert) return 'warning';
  if (ratio > TRANSPORT_SEVERITY_THRESHOLDS.normal) return 'alert';
  return 'normal';
}

export function transformTrainResponse(raw: DarwinStationBoardResponse): TrainData {
  const departures = (raw.trainServices ?? []).map((s) => parseService(s, 'departure'));
  const arrivals: TrainService[] = []; // arrivals populated separately if needed

  const allServices = [...departures, ...arrivals];
  const severity = getTransportSeverity(allServices);

  return {
    stationName: raw.locationName ?? 'Brighton',
    departures,
    arrivals,
    disruptions: raw.nrccMessages ?? [],
    severity,
  };
}

