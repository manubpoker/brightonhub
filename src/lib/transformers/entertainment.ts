import type { SkiddleEvent } from '@/types/api';
import type { EntertainmentEvent, EntertainmentOverview, EventCategory } from '@/types/domain';

export type EntertainmentData = EntertainmentOverview;

const CATEGORY_LABELS: Record<string, string> = {
  LIVE: 'Live Music',
  THEATRE: 'Theatre',
  COMEDY: 'Comedy',
  EXHIB: 'Exhibition',
  ARTS: 'Arts',
  CLUB: 'Club Night',
  FEST: 'Festival',
  KIDS: 'Kids & Family',
  DATE: 'Date Night',
  BARPUB: 'Bar & Pub',
  SPORT: 'Sport',
  LGB: 'LGBTQ+',
};

function toCategory(code: string): EventCategory {
  const valid: EventCategory[] = ['LIVE', 'THEATRE', 'COMEDY', 'EXHIB', 'ARTS', 'CLUB', 'FEST', 'KIDS', 'DATE', 'BARPUB', 'SPORT'];
  return valid.includes(code as EventCategory) ? (code as EventCategory) : 'OTHER';
}

export function transformEntertainmentResponse(raw: SkiddleEvent[]): EntertainmentData {
  const today = new Date().toISOString().split('T')[0];
  const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const events: EntertainmentEvent[] = (raw ?? []).map((e) => {
    const cat = toCategory(e.EventCode ?? '');
    return {
      id: String(e.id),
      name: e.eventname ?? '',
      date: e.date ?? '',
      description: e.description ?? '',
      link: e.link ?? '',
      imageUrl: e.largeimageurl || e.imageurl || null,
      category: cat,
      categoryLabel: CATEGORY_LABELS[cat] ?? cat,
      venue: e.venue?.name ?? '',
      venueTown: e.venue?.town ?? '',
      location: e.venue?.latitude && e.venue?.longitude
        ? { lat: e.venue.latitude, lng: e.venue.longitude }
        : null,
      entryPrice: e.entryprice || null,
      doorsOpen: e.openingtimes?.doorsopen || null,
      artists: (e.artists ?? []).map((a) => a.artistname).filter(Boolean),
    };
  });

  // Sort by date
  events.sort((a, b) => a.date.localeCompare(b.date));

  const todayCount = events.filter((e) => e.date === today).length;
  const thisWeekCount = events.filter((e) => e.date >= today && e.date <= weekEnd).length;

  return {
    events,
    totalCount: events.length,
    todayCount,
    thisWeekCount,
    severity: 'normal',
  };
}
