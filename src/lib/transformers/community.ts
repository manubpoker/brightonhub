import type { GiveFoodFoodBank } from '@/types/api';
import type { FoodBank, CommunityOverview, Severity } from '@/types/domain';

export type CommunityData = CommunityOverview;

function getCommunitySeverity(banksWithNeeds: number): Severity {
  if (banksWithNeeds >= 5) return 'severe';
  if (banksWithNeeds >= 3) return 'warning';
  if (banksWithNeeds >= 1) return 'alert';
  return 'normal';
}

function parseNeeds(needsStr: string): string[] {
  if (!needsStr || needsStr.trim() === '') return [];
  return needsStr
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function transformCommunityResponse(raw: GiveFoodFoodBank[]): CommunityData {
  const foodBanks: FoodBank[] = (raw ?? []).map((fb) => {
    const [lat, lng] = (fb.lat_lng ?? '').split(',').map(Number);
    const needs = parseNeeds(fb.needs?.needs ?? '');
    return {
      id: fb.slug,
      name: fb.name,
      network: fb.network || null,
      address: fb.address ?? '',
      postcode: fb.postcode ?? '',
      location: { lat: lat || 0, lng: lng || 0 },
      phone: fb.phone || null,
      email: fb.email || null,
      website: fb.url || null,
      needs,
      distance_m: fb.distance_m ?? 0,
      hasNeeds: needs.length > 0,
    };
  });

  const banksWithNeeds = foodBanks.filter((fb) => fb.hasNeeds).length;

  return {
    foodBanks,
    totalBanks: foodBanks.length,
    banksWithNeeds,
    severity: getCommunitySeverity(banksWithNeeds),
  };
}
