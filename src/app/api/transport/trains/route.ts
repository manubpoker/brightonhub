import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { BRIGHTON_STATION_CRS } from '@/lib/constants';
import { transformTrainResponse } from '@/lib/transformers/trains';
import { getPushPortBoard, isPushPortConfigured } from '@/lib/darwin/push-port-client';
import type { DarwinStationBoardResponse, DarwinServiceResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// LDBWS SOAP fallback (existing implementation)
// ---------------------------------------------------------------------------

const DARWIN_API_URL = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb12.aspx';

function buildSoapRequest(crs: string, numRows: number = 15): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:typ="http://thalesgroup.com/RTTI/2013-11-28/Token/types"
               xmlns:ldb="http://thalesgroup.com/RTTI/2021-11-01/ldb/">
  <soap:Header>
    <typ:AccessToken>
      <typ:TokenValue>${process.env.DARWIN_API_KEY ?? ''}</typ:TokenValue>
    </typ:AccessToken>
  </soap:Header>
  <soap:Body>
    <ldb:GetDepartureBoardRequest>
      <ldb:numRows>${numRows}</ldb:numRows>
      <ldb:crs>${crs}</ldb:crs>
    </ldb:GetDepartureBoardRequest>
  </soap:Body>
</soap:Envelope>`;
}

function parseDarwinResponse(xml: string): DarwinStationBoardResponse {
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
    isArray: (name) => name === 'service' || name === 'message',
  });

  const parsed = parser.parse(xml);
  const body = parsed?.Envelope?.Body;
  const board = body?.GetDepartureBoardResponse?.GetStationBoardResult;

  if (!board) {
    return { locationName: 'Brighton', trainServices: [], nrccMessages: [] };
  }

  const services = board.trainServices?.service ?? [];
  const messages = board.nrccMessages?.message ?? [];

  const trainServices: DarwinServiceResponse[] = (Array.isArray(services) ? services : [services])
    .filter(Boolean)
    .map((svc: Record<string, unknown>) => ({
      serviceID: (svc.serviceID as string) ?? '',
      operatorCode: (svc.operatorCode as string) ?? '',
      operator: (svc.operator as string) ?? '',
      destination: extractDestination(svc),
      std: (svc.std as string) ?? undefined,
      etd: (svc.etd as string) ?? undefined,
      sta: (svc.sta as string) ?? undefined,
      eta: (svc.eta as string) ?? undefined,
      platform: (svc.platform as string) ?? undefined,
      isCancelled: svc.isCancelled === true || svc.isCancelled === 'true',
    }));

  const nrccMessages: string[] = (Array.isArray(messages) ? messages : [messages])
    .filter(Boolean)
    .map((m: unknown) => {
      if (typeof m === 'string') return m;
      if (typeof m === 'object' && m !== null && '#text' in m) return String((m as Record<string, unknown>)['#text']);
      return String(m);
    });

  return {
    locationName: board.locationName ?? 'Brighton',
    trainServices,
    nrccMessages,
  };
}

function extractDestination(svc: Record<string, unknown>): string {
  const dest = svc.destination;
  if (!dest || typeof dest !== 'object') return 'Unknown';

  const loc = (dest as Record<string, unknown>).location;
  if (Array.isArray(loc)) {
    return loc.map((l: Record<string, unknown>) => l.locationName ?? '').join(' & ');
  }
  if (loc && typeof loc === 'object') {
    return (loc as Record<string, string>).locationName ?? 'Unknown';
  }
  return 'Unknown';
}

// ---------------------------------------------------------------------------
// GET handler — Push Port primary, LDBWS fallback
// ---------------------------------------------------------------------------

export async function GET() {
  // 1. Try Push Port (real-time streaming feed)
  if (isPushPortConfigured()) {
    try {
      const board = getPushPortBoard();
      if (board) {
        return NextResponse.json(transformTrainResponse(board));
      }
    } catch (error) {
      console.error('[PushPort] Board synthesis error:', error);
      // Fall through to LDBWS
    }
  }

  // 2. Fall back to LDBWS SOAP API
  if (!process.env.DARWIN_API_KEY) {
    return NextResponse.json(
      transformTrainResponse({
        locationName: 'Brighton',
        trainServices: [],
        nrccMessages: ['Train data requires a DARWIN_API_KEY or Push Port credentials.'],
      })
    );
  }

  try {
    const soapBody = buildSoapRequest(BRIGHTON_STATION_CRS);

    const res = await fetch(DARWIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
      },
      body: soapBody,
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`Darwin API returned ${res.status}`);
    }

    const xml = await res.text();
    const board = parseDarwinResponse(xml);
    const transformed = transformTrainResponse(board);

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Transport API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch train data' },
      { status: 502 }
    );
  }
}
