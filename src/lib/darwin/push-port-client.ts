import { Kafka, logLevel } from 'kafkajs';
import {
  DARWIN_PUSHPORT_BROKER,
  DARWIN_PUSHPORT_USER,
  DARWIN_PUSHPORT_PASS,
  DARWIN_PUSHPORT_TOPIC,
  DARWIN_PUSHPORT_GROUP,
} from '@/lib/constants';
import { parseMessageBody } from './push-port-parser';
import { PushPortStore } from './push-port-store';
import { synthesizeDepartureBoard } from './push-port-board';
import type { DarwinStationBoardResponse } from '@/types/api';

// ---------------------------------------------------------------------------
// GlobalThis singleton (survives Next.js HMR in development)
// ---------------------------------------------------------------------------

interface PushPortGlobal {
  __pushPortStore?: PushPortStore;
  __pushPortConnecting?: boolean;
  __pushPortConnected?: boolean;
  __pushPortMsgCount?: number;
}

const g = globalThis as unknown as PushPortGlobal;

// ---------------------------------------------------------------------------
// Configuration check
// ---------------------------------------------------------------------------

export function isPushPortConfigured(): boolean {
  return !!(
    DARWIN_PUSHPORT_BROKER &&
    DARWIN_PUSHPORT_USER &&
    DARWIN_PUSHPORT_PASS &&
    DARWIN_PUSHPORT_TOPIC &&
    DARWIN_PUSHPORT_GROUP
  );
}

// ---------------------------------------------------------------------------
// Store access
// ---------------------------------------------------------------------------

function getOrCreateStore(): PushPortStore {
  if (!g.__pushPortStore) {
    g.__pushPortStore = new PushPortStore();
    g.__pushPortStore.startCleanup();
  }
  return g.__pushPortStore;
}

// ---------------------------------------------------------------------------
// Kafka consumer management
// ---------------------------------------------------------------------------

/**
 * Ensure the Push Port Kafka consumer is running.
 * Idempotent — calling multiple times is safe; only connects once.
 */
export function ensurePushPortConnection(): void {
  if (!isPushPortConfigured()) return;
  if (g.__pushPortConnecting || g.__pushPortConnected) return;

  g.__pushPortConnecting = true;
  const store = getOrCreateStore();

  // Fire-and-forget: start consumer in background
  startConsumer(store).catch((err) => {
    console.error('[PushPort] Consumer startup failed:', err);
    g.__pushPortConnecting = false;
  });
}

async function startConsumer(store: PushPortStore): Promise<void> {
  const kafka = new Kafka({
    clientId: 'brightonhub',
    brokers: [DARWIN_PUSHPORT_BROKER],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: DARWIN_PUSHPORT_USER,
      password: DARWIN_PUSHPORT_PASS,
    },
    logLevel: logLevel.WARN,
    retry: {
      retries: 10,
      initialRetryTime: 1000,
      maxRetryTime: 30000,
    },
  });

  const consumer = kafka.consumer({ groupId: DARWIN_PUSHPORT_GROUP });

  consumer.on('consumer.connect', () => {
    console.log(`[PushPort] Connected to broker`);
    g.__pushPortConnected = true;
    g.__pushPortConnecting = false;
  });

  consumer.on('consumer.disconnect', () => {
    console.warn('[PushPort] Disconnected — KafkaJS will auto-reconnect');
    g.__pushPortConnected = false;
  });

  consumer.on('consumer.crash', (event) => {
    console.error('[PushPort] Consumer crash:', event.payload.error);
    g.__pushPortConnected = false;
    g.__pushPortConnecting = false;
    // Auto-reconnect after crash with backoff
    setTimeout(() => {
      console.log('[PushPort] Attempting reconnect after crash...');
      ensurePushPortConnection();
    }, 30_000);
  });

  await consumer.connect();
  await consumer.subscribe({ topic: DARWIN_PUSHPORT_TOPIC, fromBeginning: false });

  // Mark store as ready after initial messages arrive
  let readyTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
    store.markReady();
    console.log(
      `[PushPort] Store ready — ${store.brightonServices.size} Brighton services`,
    );
    readyTimer = null;
  }, 15_000);

  let msgCount = 0;
  await consumer.run({
    eachMessage: async ({ message }) => {
      const body = message.value?.toString();
      if (!body) return;

      msgCount++;
      g.__pushPortMsgCount = msgCount;

      try {
        processMessage(store, body);
      } catch (err) {
        if (msgCount <= 5) {
          console.error('[PushPort] Processing error:', err);
        }
      }

      // If we haven't marked ready yet, expedite once we have Brighton data
      if (readyTimer && store.brightonServices.size >= 3) {
        clearTimeout(readyTimer);
        readyTimer = null;
        store.markReady();
        console.log(
          `[PushPort] Store ready (early) — ${store.brightonServices.size} Brighton services`,
        );
      }
    },
  });
}

// ---------------------------------------------------------------------------
// Message processing
// ---------------------------------------------------------------------------

function processMessage(store: PushPortStore, body: string): void {
  const parsed = parseMessageBody(body);
  if (!parsed) return;

  for (const schedule of parsed.schedules) {
    store.processSchedule(schedule);
  }

  for (const status of parsed.trainStatuses) {
    store.processTrainStatus(status);
  }

  for (const rid of parsed.deactivations) {
    store.processDeactivation(rid);
  }

  for (const msg of parsed.stationMessages) {
    store.processStationMessage(msg);
  }
}

// ---------------------------------------------------------------------------
// Public API: get departure board from Push Port data
// ---------------------------------------------------------------------------

/**
 * Get a departure board built from Push Port data.
 * Returns null if Push Port is not configured.
 * Initiates connection on first call (lazy init).
 */
export function getPushPortBoard(): DarwinStationBoardResponse | null {
  if (!isPushPortConfigured()) return null;

  // Ensure connection is active
  ensurePushPortConnection();

  const store = getOrCreateStore();
  return synthesizeDepartureBoard(store);
}

/**
 * Reset Push Port connection state (forces reconnection on next request).
 */
export function resetPushPortConnection(): void {
  if (g.__pushPortStore) {
    g.__pushPortStore.stopCleanup();
  }
  g.__pushPortStore = undefined;
  g.__pushPortConnecting = false;
  g.__pushPortConnected = false;
  g.__pushPortMsgCount = 0;
  console.log('[PushPort] Connection state reset');
}

/**
 * Get diagnostic info about the Push Port connection and store state.
 */
export function getPushPortDebugInfo(): Record<string, unknown> {
  const store = g.__pushPortStore;
  return {
    connecting: !!g.__pushPortConnecting,
    connected: !!g.__pushPortConnected,
    storeExists: !!store,
    storeReady: store?.ready ?? false,
    scheduleCount: store?.schedules.size ?? 0,
    statusCount: store?.statuses.size ?? 0,
    brightonServiceCount: store?.brightonServices.size ?? 0,
    stationMessages: store?.getStationMessages() ?? [],
    sampleBrightonServices: store ? Array.from(store.brightonServices.values()).slice(0, 5).map(s => ({
      rid: s.rid,
      uid: s.uid,
      ptd: s.ptd,
      pta: s.pta,
      platform: s.platform,
      depEt: s.brightonDep?.et,
      depAt: s.brightonDep?.at,
      isCancelled: s.isCancelled,
    })) : [],
    messageCount: g.__pushPortMsgCount ?? 0,
  };
}
