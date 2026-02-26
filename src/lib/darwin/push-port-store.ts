import { BRIGHTON_TIPLOC } from '@/lib/constants';
import type {
  ParsedSchedule,
  ParsedTrainStatus,
  ParsedStationMessage,
  CallingPoint,
  StatusLocation,
} from './push-port-parser';

// ---------------------------------------------------------------------------
// Stored types (internal)
// ---------------------------------------------------------------------------

export interface StoredSchedule {
  rid: string;
  uid: string;
  trainId: string;
  ssd: string;
  toc: string;
  isPassengerSvc: boolean;
  isCancelled: boolean;
  callingPoints: CallingPoint[];
  receivedAt: number;
}

export interface StoredStatus {
  rid: string;
  uid: string;
  ssd: string;
  isCancelled: boolean;
  locations: Map<string, StatusLocation>;
  lateReason?: string;
  receivedAt: number;
}

/**
 * A Brighton service discovered from status updates alone (no schedule).
 * We track these to build the departure board when schedules aren't available.
 */
export interface DiscoveredBrightonService {
  rid: string;
  uid: string;
  ssd: string;
  /** Brighton departure — estimated or actual */
  brightonDep?: { et?: string; at?: string };
  /** Brighton arrival — estimated or actual */
  brightonArr?: { et?: string; at?: string };
  /** Scheduled departure time from Brighton (pta/ptd from the Location) */
  ptd?: string;
  pta?: string;
  platform?: string;
  platSuppressed?: boolean;
  isCancelled: boolean;
  lateReason?: string;
  receivedAt: number;
}

// ---------------------------------------------------------------------------
// PushPortStore — in-memory store for Brighton-relevant train data
// ---------------------------------------------------------------------------

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;    // 5 minutes
const MAX_AGE_MS = 4 * 60 * 60 * 1000;        // 4 hours
const MAX_STORE_SIZE = 5000;                    // max entries per map

export class PushPortStore {
  readonly schedules = new Map<string, StoredSchedule>();
  readonly statuses = new Map<string, StoredStatus>();
  /** Services discovered from status updates mentioning Brighton */
  readonly brightonServices = new Map<string, DiscoveredBrightonService>();
  private stationMessages = new Map<string, string>(); // crs -> latest message
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private _ready = false;

  get ready(): boolean {
    return this._ready;
  }

  markReady(): void {
    this._ready = true;
  }

  // -------------------------------------------------------------------------
  // Ingest methods
  // -------------------------------------------------------------------------

  processSchedule(schedule: ParsedSchedule): void {
    // Only store schedules that touch Brighton
    const touchesBrighton = schedule.callingPoints.some(
      (cp) => cp.tpl === BRIGHTON_TIPLOC
    );
    if (!touchesBrighton) return;

    // Evict oldest entries if at capacity
    if (this.schedules.size >= MAX_STORE_SIZE && !this.schedules.has(schedule.rid)) {
      this.evictOldest(this.schedules);
    }

    this.schedules.set(schedule.rid, {
      ...schedule,
      receivedAt: Date.now(),
    });
  }

  processTrainStatus(status: ParsedTrainStatus): void {
    const now = Date.now();

    // Check if this status update mentions Brighton
    const brightonLoc = status.locations.find(loc => loc.tpl === BRIGHTON_TIPLOC);

    if (brightonLoc) {
      // Discovered a Brighton service from status update!
      const existing = this.brightonServices.get(status.rid);
      this.brightonServices.set(status.rid, {
        rid: status.rid,
        uid: status.uid,
        ssd: status.ssd,
        brightonDep: brightonLoc.dep ?? existing?.brightonDep,
        brightonArr: brightonLoc.arr ?? existing?.brightonArr,
        ptd: brightonLoc.ptd ?? existing?.ptd,
        pta: brightonLoc.pta ?? existing?.pta,
        platform: brightonLoc.plat ?? existing?.platform,
        platSuppressed: brightonLoc.platSuppressed ?? existing?.platSuppressed,
        isCancelled: status.isCancelled,
        lateReason: status.lateReason ?? existing?.lateReason,
        receivedAt: now,
      });
    }

    // Store in statuses map — merge locations over time to build up route picture
    // Also track status updates for already-discovered Brighton services even if
    // this particular update doesn't mention Brighton (builds route picture)
    if (this.schedules.has(status.rid) || this.brightonServices.has(status.rid)) {
      const existing = this.statuses.get(status.rid);
      const locationMap = existing ? new Map(existing.locations) : new Map<string, StatusLocation>();
      for (const loc of status.locations) {
        locationMap.set(loc.tpl, loc);
      }

      this.statuses.set(status.rid, {
        rid: status.rid,
        uid: status.uid,
        ssd: status.ssd,
        isCancelled: status.isCancelled,
        locations: locationMap,
        lateReason: status.lateReason ?? existing?.lateReason,
        receivedAt: now,
      });
    }
  }

  processDeactivation(rid: string): void {
    this.schedules.delete(rid);
    this.statuses.delete(rid);
    this.brightonServices.delete(rid);
  }

  processStationMessage(msg: ParsedStationMessage): void {
    // Store messages for Brighton (CRS: BTN)
    if (msg.crs === 'BTN') {
      this.stationMessages.set(msg.crs, msg.message);
    }
  }

  // -------------------------------------------------------------------------
  // Query methods
  // -------------------------------------------------------------------------

  getSchedule(rid: string): StoredSchedule | undefined {
    return this.schedules.get(rid);
  }

  getStatus(rid: string): StoredStatus | undefined {
    return this.statuses.get(rid);
  }

  getBrightonService(rid: string): DiscoveredBrightonService | undefined {
    return this.brightonServices.get(rid);
  }

  getStationMessages(): string[] {
    return Array.from(this.stationMessages.values());
  }

  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------

  startCleanup(): void {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setInterval(() => this.cleanup(), CLEANUP_INTERVAL_MS);
    // Don't prevent process exit
    if (this.cleanupTimer && typeof this.cleanupTimer === 'object' && 'unref' in this.cleanupTimer) {
      this.cleanupTimer.unref();
    }
  }

  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  private evictOldest(map: Map<string, { receivedAt: number }>): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    for (const [key, val] of map) {
      if (val.receivedAt < oldestTime) {
        oldestTime = val.receivedAt;
        oldestKey = key;
      }
    }
    if (oldestKey) map.delete(oldestKey);
  }

  isAlive(): boolean {
    if (!this._ready) return false;
    // Consider store alive if it received data within the last 10 minutes
    const cutoff = Date.now() - 10 * 60 * 1000;
    for (const svc of this.brightonServices.values()) {
      if (svc.receivedAt > cutoff) return true;
    }
    return false;
  }

  private cleanup(): void {
    const cutoff = Date.now() - MAX_AGE_MS;
    let removed = 0;

    for (const [rid, schedule] of this.schedules) {
      if (schedule.receivedAt < cutoff) {
        this.schedules.delete(rid);
        this.statuses.delete(rid);
        removed++;
      }
    }

    // Clean old Brighton services
    for (const [rid, svc] of this.brightonServices) {
      if (svc.receivedAt < cutoff) {
        this.brightonServices.delete(rid);
        this.statuses.delete(rid);
      }
    }

    // Also clean orphan statuses
    for (const rid of this.statuses.keys()) {
      if (!this.schedules.has(rid) && !this.brightonServices.has(rid)) {
        this.statuses.delete(rid);
      }
    }

    if (removed > 0) {
      console.log(`[PushPort] Cleanup: removed ${removed} old entries, ${this.schedules.size} schedules, ${this.brightonServices.size} services remaining`);
    }
  }
}
