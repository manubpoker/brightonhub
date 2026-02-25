import { BRIGHTON_TIPLOC } from '@/lib/constants';
import type { DarwinStationBoardResponse, DarwinServiceResponse } from '@/types/api';
import { getStationName } from './tiploc-names';
import { getTocName } from './toc-names';
import type { PushPortStore, DiscoveredBrightonService } from './push-port-store';

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

/**
 * Parse an HH:MM time string into minutes-since-midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Check whether a departure time (HH:MM) falls within the display window:
 * from 5 minutes ago to 2 hours from now.
 */
function isInDepartureWindow(ptd: string, nowMinutes: number): boolean {
  const depMinutes = timeToMinutes(ptd);

  // Difference handling midnight wraparound
  let diff = depMinutes - nowMinutes;
  if (diff > 720) diff -= 1440;   // e.g. dep=00:10 now=23:50 → diff should be +20
  if (diff < -720) diff += 1440;  // e.g. dep=23:50 now=00:10 → diff should be -20

  // Window: -5 min (recently departed) to +120 min (next 2 hours)
  return diff >= -5 && diff <= 120;
}

// ---------------------------------------------------------------------------
// Board synthesis from schedule data (original approach)
// ---------------------------------------------------------------------------

function synthesizeFromSchedules(
  store: PushPortStore,
  nowMinutes: number,
  limit: number,
): DarwinServiceResponse[] {
  const departures: DarwinServiceResponse[] = [];

  for (const [rid, schedule] of store.schedules) {
    if (!schedule.isPassengerSvc) continue;

    const brightonIdx = schedule.callingPoints.findIndex(
      (cp) => cp.tpl === BRIGHTON_TIPLOC
    );
    if (brightonIdx === -1) continue;

    const brightonPoint = schedule.callingPoints[brightonIdx];
    if (brightonPoint.type === 'DT' || brightonPoint.type === 'OPDT') continue;

    const ptd = brightonPoint.ptd;
    if (!ptd) continue;
    if (!isInDepartureWindow(ptd, nowMinutes)) continue;

    let destTiploc = schedule.callingPoints[schedule.callingPoints.length - 1].tpl;
    for (let i = schedule.callingPoints.length - 1; i >= 0; i--) {
      const cp = schedule.callingPoints[i];
      if (cp.type === 'DT' || cp.type === 'OPDT') {
        destTiploc = cp.tpl;
        break;
      }
    }

    const status = store.getStatus(rid);
    let etd: string = 'On time';
    let platform: string | undefined;
    let isCancelled = schedule.isCancelled;

    if (status) {
      if (status.isCancelled) isCancelled = true;

      const brightonStatus = status.locations.get(BRIGHTON_TIPLOC);
      if (brightonStatus) {
        if (brightonStatus.plat && !brightonStatus.platSuppressed) {
          platform = brightonStatus.plat;
        }
        if (brightonStatus.dep) {
          if (brightonStatus.dep.at) {
            etd = brightonStatus.dep.at;
          } else if (brightonStatus.dep.et) {
            etd = brightonStatus.dep.et === ptd ? 'On time' : brightonStatus.dep.et;
          }
        }
      }
    }

    if (isCancelled) etd = 'Cancelled';

    departures.push({
      serviceID: rid,
      operatorCode: schedule.toc,
      operator: getTocName(schedule.toc),
      destination: getStationName(destTiploc),
      std: ptd,
      etd,
      platform,
      isCancelled,
    });
  }

  return departures;
}

// ---------------------------------------------------------------------------
// Board synthesis from discovered Brighton services (status-only approach)
// ---------------------------------------------------------------------------

/**
 * Infer the destination of a Brighton service from accumulated status locations.
 * Looks for the furthest-along location that has a scheduled arrival time
 * AFTER Brighton's departure time.
 */
function inferDestination(
  store: PushPortStore,
  rid: string,
  brightonPtd?: string,
): string {
  const status = store.getStatus(rid);
  if (!status || status.locations.size === 0) return '';

  const brightonMinutes = brightonPtd ? timeToMinutes(brightonPtd) : -1;

  // Find the location with the latest scheduled time (likely the destination)
  let bestTpl = '';
  let bestMinutes = -1;

  for (const [tpl, loc] of status.locations) {
    if (tpl === BRIGHTON_TIPLOC) continue;

    // Use pta or ptd as the scheduled time at this location
    const timeStr = loc.pta ?? loc.ptd;
    if (!timeStr) continue;

    const minutes = timeToMinutes(timeStr);
    // Only consider locations after Brighton's departure
    let diff = minutes - brightonMinutes;
    if (diff < -720) diff += 1440; // midnight wraparound

    if (diff > 0 && minutes > bestMinutes) {
      bestMinutes = minutes;
      bestTpl = tpl;
    }
  }

  return bestTpl ? getStationName(bestTpl) : '';
}

function synthesizeFromDiscoveredServices(
  store: PushPortStore,
  nowMinutes: number,
  limit: number,
): DarwinServiceResponse[] {
  const departures: DarwinServiceResponse[] = [];

  for (const [rid, svc] of store.brightonServices) {
    // Must have a scheduled departure time
    const ptd = svc.ptd;
    if (!ptd) continue;

    if (!isInDepartureWindow(ptd, nowMinutes)) continue;

    let etd: string = 'On time';
    let platform: string | undefined;

    if (svc.platform && !svc.platSuppressed) {
      platform = svc.platform;
    }

    if (svc.brightonDep) {
      if (svc.brightonDep.at) {
        etd = svc.brightonDep.at;
      } else if (svc.brightonDep.et) {
        etd = svc.brightonDep.et === ptd ? 'On time' : svc.brightonDep.et;
      }
    }

    if (svc.isCancelled) {
      etd = 'Cancelled';
    }

    // Try to infer destination from accumulated status locations
    const destination = inferDestination(store, rid, ptd) || '';

    departures.push({
      serviceID: rid,
      operatorCode: '',
      operator: '',
      destination,
      std: ptd,
      etd,
      platform,
      isCancelled: svc.isCancelled,
    });
  }

  return departures;
}

// ---------------------------------------------------------------------------
// Main: Build departure board
// ---------------------------------------------------------------------------

/**
 * Build a DarwinStationBoardResponse from the Push Port store.
 * Uses schedule data when available, falls back to discovered Brighton
 * services from status updates.
 */
export function synthesizeDepartureBoard(
  store: PushPortStore,
  limit: number = 15,
): DarwinStationBoardResponse {
  if (!store.ready) {
    return {
      locationName: 'Brighton',
      trainServices: [],
      nrccMessages: ['Connecting to live train feed...'],
    };
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Try schedule-based board first (most accurate)
  let departures = synthesizeFromSchedules(store, nowMinutes, limit);

  // If no schedules available, use discovered services from status updates
  if (departures.length === 0) {
    departures = synthesizeFromDiscoveredServices(store, nowMinutes, limit);
  }

  // Sort by scheduled departure time
  departures.sort((a, b) => {
    const aMin = timeToMinutes(a.std ?? '00:00');
    const bMin = timeToMinutes(b.std ?? '00:00');
    const aDiff = ((aMin - nowMinutes) + 1440) % 1440;
    const bDiff = ((bMin - nowMinutes) + 1440) % 1440;
    return aDiff - bDiff;
  });

  return {
    locationName: 'Brighton',
    trainServices: departures.slice(0, limit),
    nrccMessages: store.getStationMessages(),
  };
}
