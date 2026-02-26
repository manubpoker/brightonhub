import { NextResponse } from 'next/server';
import { FLOOD_API_URL } from '@/lib/constants';
import { transformFloodWarnings } from '@/lib/transformers/flood';
import type { FloodWarningsResponse } from '@/types/api';

export async function GET() {
  try {
    // Fetch flood warnings for Brighton-area counties
    const counties = ['East Sussex', 'West Sussex', 'Brighton and Hove'];
    const fetches = counties.map((county) =>
      fetch(
        `${FLOOD_API_URL}/id/floods?county=${encodeURIComponent(county)}`,
        { next: { revalidate: 300 }, signal: AbortSignal.timeout(10000) }
      ).then((r) => (r.ok ? r.json() : { items: [] }))
    );

    const results: FloodWarningsResponse[] = await Promise.all(fetches);

    // Combine and deduplicate by @id
    const seen = new Set<string>();
    const allItems: FloodWarningsResponse['items'] = [];
    for (const result of results) {
      for (const item of result?.items ?? []) {
        const id = item['@id'];
        if (id && !seen.has(id)) {
          seen.add(id);
          allItems.push(item);
        }
      }
    }

    const transformed = transformFloodWarnings({ items: allItems });

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Flood API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flood data' },
      { status: 502 }
    );
  }
}
