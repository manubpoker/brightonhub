import { NextResponse } from 'next/server';
import { PLANNING_API_URL, BRIGHTON_ORG_ENTITY } from '@/lib/constants';
import { transformPlanningResponse } from '@/lib/transformers/planning';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Use the correct entity.json endpoint with dataset filter
    const res = await fetch(
      `${PLANNING_API_URL}/entity.json?dataset=planning-application&organisation_entity=${BRIGHTON_ORG_ENTITY}&limit=50`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`Planning API returned ${res.status}`);
    }

    const data = await res.json();
    const transformed = transformPlanningResponse(data);

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Planning API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch planning data' },
      { status: 502 }
    );
  }
}
