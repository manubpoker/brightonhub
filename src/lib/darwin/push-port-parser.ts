import { XMLParser } from 'fast-xml-parser';
import { gunzipSync } from 'zlib';

// ---------------------------------------------------------------------------
// Types for parsed Push Port messages
// ---------------------------------------------------------------------------

export interface CallingPoint {
  type: 'OR' | 'IP' | 'DT' | 'PP' | 'OPOR' | 'OPIP' | 'OPDT';
  tpl: string;
  pta?: string;
  ptd?: string;
}

export interface ParsedSchedule {
  rid: string;
  uid: string;
  trainId: string;
  ssd: string;
  toc: string;
  isPassengerSvc: boolean;
  isCancelled: boolean;
  callingPoints: CallingPoint[];
}

export interface StatusLocation {
  tpl: string;
  pta?: string;   // public scheduled arrival time
  ptd?: string;   // public scheduled departure time
  arr?: { et?: string; at?: string };
  dep?: { et?: string; at?: string };
  plat?: string;
  platSuppressed?: boolean;
}

export interface ParsedTrainStatus {
  rid: string;
  uid: string;
  ssd: string;
  isCancelled: boolean;
  locations: StatusLocation[];
  lateReason?: string;
}

export interface ParsedStationMessage {
  crs: string;
  message: string;
}

export interface ParsedPushPortMessage {
  schedules: ParsedSchedule[];
  trainStatuses: ParsedTrainStatus[];
  deactivations: string[];
  stationMessages: ParsedStationMessage[];
}

// ---------------------------------------------------------------------------
// XML Parser instance (reused)
// ---------------------------------------------------------------------------

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  attributeNamePrefix: '@_',
  isArray: (_name: string) => {
    // Elements that can appear multiple times in a single message
    return [
      'schedule', 'TS', 'deactivated', 'OW',
      'OR', 'IP', 'DT', 'PP', 'OPOR', 'OPIP', 'OPDT',
      'Location', 'Station', 'Msg', 'message',
    ].includes(_name);
  },
});

// ---------------------------------------------------------------------------
// Helpers — support both XML-parsed (@_key) and native JSON (key) formats
// ---------------------------------------------------------------------------

function ensureArray<T>(val: T | T[] | undefined | null): T[] {
  if (val == null) return [];
  return Array.isArray(val) ? val : [val];
}

/** Read a string attribute — checks both @_key (XML) and key (JSON) */
function attrStr(obj: Record<string, unknown>, key: string): string {
  // Try with @_ prefix first (XML parsed format), then bare key (JSON format)
  const v = obj[`@_${key}`] ?? obj[key];
  return typeof v === 'string' ? v : '';
}

/** Read a boolean attribute — checks both @_key (XML) and key (JSON) */
function attrBool(obj: Record<string, unknown>, key: string): boolean {
  const v = obj[`@_${key}`] ?? obj[key];
  return v === true || v === 'true';
}

/** Check if an attribute exists (in either format) */
function attrExists(obj: Record<string, unknown>, key: string): boolean {
  return (`@_${key}` in obj) || (key in obj);
}

/**
 * Extract text content from an element that may be a simple string
 * or an object with attributes.
 *
 * Handles multiple formats:
 * - XML parsed: `<plat>3</plat>` → 3 (number/string)
 * - XML with attrs: `<plat platsup="true">3</plat>` → {"@_platsup":"true","#text":"3"}
 * - JSON format: `{"platsrc":"A","conf":"true","":"1"}` → text is in "" key
 */
function textContent(val: unknown): string | undefined {
  if (val == null) return undefined;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    // XML parsed format
    if ('#text' in obj) return String(obj['#text']);
    // JSON format: the text value is stored under an empty key ""
    if ('' in obj) return String(obj['']);
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Calling-point extraction from schedule
// ---------------------------------------------------------------------------

const POINT_TYPES = ['OR', 'IP', 'DT', 'PP', 'OPOR', 'OPIP', 'OPDT'] as const;

function extractCallingPoints(sched: Record<string, unknown>): CallingPoint[] {
  const points: CallingPoint[] = [];
  for (const type of POINT_TYPES) {
    for (const raw of ensureArray(sched[type] as Record<string, unknown> | undefined)) {
      if (!raw || typeof raw !== 'object') continue;
      const r = raw as Record<string, unknown>;
      points.push({
        type,
        tpl: attrStr(r, 'tpl'),
        pta: attrStr(r, 'pta') || undefined,
        ptd: attrStr(r, 'ptd') || undefined,
      });
    }
  }
  return points;
}

// ---------------------------------------------------------------------------
// Schedule parsing
// ---------------------------------------------------------------------------

function parseSchedule(raw: Record<string, unknown>): ParsedSchedule {
  return {
    rid: attrStr(raw, 'rid'),
    uid: attrStr(raw, 'uid'),
    trainId: attrStr(raw, 'trainId'),
    ssd: attrStr(raw, 'ssd'),
    toc: attrStr(raw, 'toc'),
    isPassengerSvc: raw['@_isPassengerSvc'] !== 'false' && raw['isPassengerSvc'] !== false,
    isCancelled: (attrExists(raw, 'isActive') && !attrBool(raw, 'isActive')),
    callingPoints: extractCallingPoints(raw),
  };
}

// ---------------------------------------------------------------------------
// Train status parsing
// ---------------------------------------------------------------------------

function parseTimingEntry(obj: unknown): { et?: string; at?: string } | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const o = obj as Record<string, unknown>;
  // JSON format uses bare keys; XML parsed uses @_ prefix
  const et = attrStr(o, 'et') || undefined;
  const at = attrStr(o, 'at') || undefined;
  if (!et && !at) return undefined;
  return { et, at };
}

function parseTrainStatus(raw: Record<string, unknown>): ParsedTrainStatus {
  const locations: StatusLocation[] = [];

  for (const loc of ensureArray(raw['Location'] as Record<string, unknown> | undefined)) {
    if (!loc || typeof loc !== 'object') continue;
    const l = loc as Record<string, unknown>;
    const platRaw = l['plat'];
    let plat = textContent(platRaw);
    let platSuppressed = false;
    if (platRaw && typeof platRaw === 'object') {
      const platObj = platRaw as Record<string, unknown>;
      platSuppressed = attrBool(platObj, 'platsup') ||
                       platObj['platsup'] === 'true' ||
                       platObj['cisPlatsup'] === 'true';
    }
    // Suppress "0" platform (used as placeholder)
    if (plat === '0') plat = undefined;

    locations.push({
      tpl: attrStr(l, 'tpl'),
      pta: attrStr(l, 'pta') || undefined,
      ptd: attrStr(l, 'ptd') || undefined,
      arr: parseTimingEntry(l['arr']),
      dep: parseTimingEntry(l['dep']),
      plat,
      platSuppressed,
    });
  }

  const lateReasonRaw = raw['LateReason'];
  const lateReason = textContent(lateReasonRaw);

  return {
    rid: attrStr(raw, 'rid'),
    uid: attrStr(raw, 'uid'),
    ssd: attrStr(raw, 'ssd'),
    isCancelled: attrBool(raw, 'isCanc'),
    locations,
    lateReason,
  };
}

// ---------------------------------------------------------------------------
// Station message parsing
// ---------------------------------------------------------------------------

function parseStationMessages(raw: Record<string, unknown>): ParsedStationMessage[] {
  const messages: ParsedStationMessage[] = [];
  for (const station of ensureArray(raw['Station'] as Record<string, unknown> | undefined)) {
    if (!station || typeof station !== 'object') continue;
    const s = station as Record<string, unknown>;
    const crs = attrStr(s, 'crs');
    for (const msg of ensureArray(s['Msg'])) {
      const text = textContent(msg);
      if (text && crs) {
        messages.push({ crs, message: text });
      }
    }
  }
  return messages;
}

// ---------------------------------------------------------------------------
// Main entry: parse a raw message body
// ---------------------------------------------------------------------------

/**
 * Parse a Push Port message body. Auto-detects format:
 * 1. JSON envelope (RDM) with JSON `bytes` field (Push Port v18 native JSON)
 * 2. JSON envelope (RDM) with base64-encoded `bytes` field (gzipped XML)
 * 3. JSON envelope (RDM) with `text` field (XML string)
 * 4. Gzip-compressed XML
 * 5. Raw XML
 */
export function parseMessageBody(raw: string): ParsedPushPortMessage | null {
  try {
    // Try JSON envelope first (RDM Kafka format — JMS message serialized as JSON)
    if (raw.trimStart().startsWith('{')) {
      const envelope = JSON.parse(raw) as Record<string, unknown>;

      // RDM wraps ActiveMQ messages as JSON. The PushPort data can be in:
      //  - "bytes" field — JSON string (v18 native) or base64-encoded gzipped XML
      //  - "text" field — plain XML string or base64

      if (typeof envelope.bytes === 'string' && envelope.bytes.length > 0) {
        const bytesStr = envelope.bytes as string;

        // v18 native JSON: bytes is a JSON string (starts with '{')
        if (bytesStr.trimStart().startsWith('{')) {
          const jsonData = JSON.parse(bytesStr) as Record<string, unknown>;
          return parsePushPortData(jsonData);
        }

        // Legacy: base64-encoded, possibly gzipped XML
        const buf = Buffer.from(bytesStr, 'base64');
        if (buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
          const xml = gunzipSync(buf).toString('utf-8');
          if (xml.trimStart().startsWith('<')) return parseXml(xml);
          return null;
        }
        const decoded = buf.toString('utf-8');
        if (decoded.trimStart().startsWith('<')) return parseXml(decoded);
        return null;
      }

      if (typeof envelope.text === 'string' && envelope.text.length > 0) {
        const text = envelope.text as string;
        if (text.trimStart().startsWith('<')) {
          return parseXml(text);
        }
        // text might be base64
        const buf = Buffer.from(text, 'base64');
        if (buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
          const xml = gunzipSync(buf).toString('utf-8');
          if (xml.trimStart().startsWith('<')) return parseXml(xml);
          return null;
        }
        const decoded = buf.toString('utf-8');
        if (decoded.trimStart().startsWith('<')) return parseXml(decoded);
        return null;
      }

      return null;
    }

    if (raw.trimStart().startsWith('<')) {
      return parseXml(raw);
    }

    // Try as raw base64
    const buf = Buffer.from(raw, 'base64');
    if (buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
      const xml = gunzipSync(buf).toString('utf-8');
      if (xml.trimStart().startsWith('<')) return parseXml(xml);
      return null;
    }
    const decoded = buf.toString('utf-8');
    if (decoded.trimStart().startsWith('<')) return parseXml(decoded);
    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Parse Push Port data structure (works for both XML-parsed and native JSON)
// ---------------------------------------------------------------------------

function parsePushPortData(data: Record<string, unknown>): ParsedPushPortMessage {
  // Handle XML wrapper: <Pport>...</Pport>
  const pport = (data?.Pport ?? data) as Record<string, unknown>;

  const result: ParsedPushPortMessage = {
    schedules: [],
    trainStatuses: [],
    deactivations: [],
    stationMessages: [],
  };

  // Schedule messages: sR > schedule
  const sR = pport?.sR as Record<string, unknown> | undefined;
  if (sR) {
    for (const sched of ensureArray(sR['schedule'] as Record<string, unknown> | undefined)) {
      if (sched && typeof sched === 'object') {
        result.schedules.push(parseSchedule(sched as Record<string, unknown>));
      }
    }
  }

  // Update messages: uR > TS | deactivated | OW
  const uR = pport?.uR as Record<string, unknown> | undefined;
  if (uR) {
    // Train status updates
    for (const ts of ensureArray(uR['TS'] as Record<string, unknown> | undefined)) {
      if (ts && typeof ts === 'object') {
        result.trainStatuses.push(parseTrainStatus(ts as Record<string, unknown>));
      }
    }

    // Deactivations
    for (const deact of ensureArray(uR['deactivated'] as Record<string, unknown> | undefined)) {
      if (deact && typeof deact === 'object') {
        const rid = attrStr(deact as Record<string, unknown>, 'rid');
        if (rid) result.deactivations.push(rid);
      }
    }

    // Station messages (NRCC)
    for (const ow of ensureArray(uR['OW'] as Record<string, unknown> | undefined)) {
      if (ow && typeof ow === 'object') {
        result.stationMessages.push(...parseStationMessages(ow as Record<string, unknown>));
      }
    }
  }

  return result;
}

function parseXml(xml: string): ParsedPushPortMessage {
  const parsed = xmlParser.parse(xml);
  return parsePushPortData(parsed as Record<string, unknown>);
}
