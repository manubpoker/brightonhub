import { NextResponse } from 'next/server';
import { isPushPortConfigured, getPushPortBoard, getPushPortDebugInfo, resetPushPortConnection } from '@/lib/darwin/push-port-client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reset = url.searchParams.get('reset') === '1';

  if (reset) {
    resetPushPortConnection();
    return NextResponse.json({ message: 'Push Port connection reset. Next request will reconnect.' });
  }

  const configured = isPushPortConfigured();
  const board = configured ? getPushPortBoard() : null;
  const debug = getPushPortDebugInfo();

  return NextResponse.json({
    pushPortConfigured: configured,
    darwinApiKey: !!process.env.DARWIN_API_KEY,
    store: debug,
    board: board ? {
      locationName: board.locationName,
      serviceCount: board.trainServices.length,
      messageCount: board.nrccMessages?.length ?? 0,
      messages: board.nrccMessages ?? [],
      sampleServices: board.trainServices.slice(0, 5).map(s => ({
        destination: s.destination,
        std: s.std,
        etd: s.etd,
        operator: s.operator,
        platform: s.platform,
      })),
    } : null,
  });
}
