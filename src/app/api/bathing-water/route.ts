import { NextResponse } from 'next/server';
import { BATHING_WATER_API_URL, BRIGHTON_BEACHES } from '@/lib/constants';
import { transformBathingWaterResponse, createBathingWaterOverview } from '@/lib/transformers/bathing-water';
import type { BathingWaterProfileResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results = await Promise.allSettled(
      BRIGHTON_BEACHES.map(async (beach) => {
        const res = await fetch(`${BATHING_WATER_API_URL}/${beach.id}.json`, {
          next: { revalidate: 21600 }, // 6 hours
        });

        if (!res.ok) {
          throw new Error(`Bathing water API returned ${res.status} for ${beach.name}`);
        }

        const data: BathingWaterProfileResponse = await res.json();
        return transformBathingWaterResponse(beach.id, beach.name, data);
      })
    );

    const beaches = results
      .filter((r): r is PromiseFulfilledResult<ReturnType<typeof transformBathingWaterResponse>> => r.status === 'fulfilled')
      .map((r) => r.value);

    if (beaches.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch bathing water data' },
        { status: 502 }
      );
    }

    const overview = createBathingWaterOverview(beaches);
    return NextResponse.json(overview);
  } catch (error) {
    console.error('Bathing water API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bathing water data' },
      { status: 502 }
    );
  }
}
