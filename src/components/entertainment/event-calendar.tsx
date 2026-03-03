'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, MapPin, Music, ExternalLink } from 'lucide-react';
import type { EntertainmentEvent, EventCategory } from '@/types/domain';
import { getLocalDateString } from '@/lib/date-utils';

const CATEGORY_COLORS: Record<string, string> = {
  LIVE: 'bg-rose-100 text-rose-700',
  THEATRE: 'bg-purple-100 text-purple-700',
  COMEDY: 'bg-amber-100 text-amber-700',
  EXHIB: 'bg-teal-100 text-teal-700',
  ARTS: 'bg-violet-100 text-violet-700',
  CLUB: 'bg-blue-100 text-blue-700',
  FEST: 'bg-orange-100 text-orange-700',
  KIDS: 'bg-green-100 text-green-700',
  DATE: 'bg-pink-100 text-pink-700',
  BARPUB: 'bg-yellow-100 text-yellow-700',
  SPORT: 'bg-red-100 text-red-700',
  OTHER: 'bg-muted text-foreground',
};

const FILTER_CATEGORIES: { code: EventCategory | 'ALL'; label: string }[] = [
  { code: 'ALL', label: 'All' },
  { code: 'LIVE', label: 'Music' },
  { code: 'THEATRE', label: 'Theatre' },
  { code: 'COMEDY', label: 'Comedy' },
  { code: 'EXHIB', label: 'Exhibitions' },
  { code: 'ARTS', label: 'Arts' },
  { code: 'CLUB', label: 'Club' },
  { code: 'FEST', label: 'Festivals' },
  { code: 'KIDS', label: 'Kids' },
];

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === getLocalDateString(today)) return 'Today';
  if (dateStr === getLocalDateString(tomorrow)) return 'Tomorrow';

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-GB', { weekday: 'short' });
}

function formatDayNum(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return String(date.getDate());
}

function formatMonth(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-GB', { month: 'short' });
}

interface EventCalendarProps {
  events: EntertainmentEvent[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [filter, setFilter] = useState<EventCategory | 'ALL'>('ALL');

  const filtered = filter === 'ALL'
    ? events
    : events.filter((e) => e.category === filter);

  // Group events by date
  const grouped = new Map<string, EntertainmentEvent[]>();
  for (const event of filtered) {
    const existing = grouped.get(event.date) ?? [];
    existing.push(event);
    grouped.set(event.date, existing);
  }

  const dates = [...grouped.keys()].sort();

  return (
    <div className="space-y-4">
      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        {FILTER_CATEGORIES.map(({ code, label }) => {
          const count = code === 'ALL'
            ? events.length
            : events.filter((e) => e.category === code).length;
          if (code !== 'ALL' && count === 0) return null;
          return (
            <button
              key={code}
              onClick={() => setFilter(code)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                filter === code
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Vertical calendar */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No events found for this filter</p>
      ) : (
        <div className="space-y-0">
          {dates.map((dateStr) => {
            const dayEvents = grouped.get(dateStr)!;
            const today = getLocalDateString();
            const isToday = dateStr === today;

            return (
              <div key={dateStr} className="flex gap-0">
                {/* Date column */}
                <div className="flex-shrink-0 w-16 sm:w-20 pt-3">
                  <div className={cn(
                    'text-center rounded-lg py-2 px-1',
                    isToday ? 'bg-rose-600 text-white' : 'bg-muted/50'
                  )}>
                    <p className={cn('text-[10px] uppercase font-semibold', isToday ? 'text-rose-100' : 'text-muted-foreground/70')}>
                      {formatDayOfWeek(dateStr)}
                    </p>
                    <p className={cn('text-xl font-bold leading-tight', isToday ? 'text-white' : 'text-foreground')}>
                      {formatDayNum(dateStr)}
                    </p>
                    <p className={cn('text-[10px] uppercase', isToday ? 'text-rose-100' : 'text-muted-foreground/70')}>
                      {formatMonth(dateStr)}
                    </p>
                  </div>
                </div>

                {/* Events column */}
                <div className="flex-1 min-w-0 border-l-2 border-border pl-4 pb-6 ml-2 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wide pt-3 pb-1">
                    {formatDateHeader(dateStr)} &middot; {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                  </h3>
                  {dayEvents.map((event) => (
                    <a
                      key={event.id}
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-lg border bg-white p-3 hover:shadow-md hover:border-rose-200 transition-all"
                    >
                      <div className="flex gap-3">
                        {/* Image */}
                        {event.imageUrl && (
                          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={event.imageUrl}
                              alt={event.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              unoptimized
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-foreground group-hover:text-rose-700 truncate">
                              {event.name}
                            </h4>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-rose-400 flex-shrink-0 mt-0.5" />
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.venue}
                            </span>
                            {event.doorsOpen && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.doorsOpen}
                              </span>
                            )}
                            {event.artists.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Music className="h-3 w-3" />
                                {event.artists.slice(0, 2).join(', ')}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge className={cn('text-[10px] px-1.5 py-0', CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.OTHER)}>
                              {event.categoryLabel}
                            </Badge>
                            {event.entryPrice && event.entryPrice !== '0' && (
                              <span className="text-[10px] font-medium text-muted-foreground">
                                From £{event.entryPrice}
                              </span>
                            )}
                            {event.entryPrice === '0' && (
                              <span className="text-[10px] font-medium text-green-600">
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
