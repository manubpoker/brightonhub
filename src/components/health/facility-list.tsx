'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { HealthFacility } from '@/types/domain';

const TYPE_LABELS: Record<string, string> = {
  gp: 'GP Practice',
  pharmacy: 'Pharmacy',
  hospital: 'Hospital',
  dental: 'Dentist',
};

const TYPE_COLORS: Record<string, string> = {
  gp: 'bg-pink-100 text-pink-700',
  pharmacy: 'bg-green-100 text-green-700',
  hospital: 'bg-blue-100 text-blue-700',
  dental: 'bg-purple-100 text-purple-700',
};

interface FacilityListProps {
  facilities: HealthFacility[];
}

export function FacilityList({ facilities }: FacilityListProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const types = ['gp', 'pharmacy', 'hospital', 'dental'] as const;

  const filtered = filter ? facilities.filter((f) => f.type === filter) : facilities;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">NHS Facilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter(null)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              filter === null
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            All ({facilities.length})
          </button>
          {types.map((type) => {
            const count = facilities.filter((f) => f.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setFilter(filter === type ? null : type)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  filter === type
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                )}
              >
                {TYPE_LABELS[type]} ({count})
              </button>
            );
          })}
        </div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filtered.map((facility) => (
            <div
              key={facility.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{facility.name}</p>
                {facility.postcode && (
                  <p className="text-xs text-muted-foreground">{facility.postcode}</p>
                )}
              </div>
              <Badge className={TYPE_COLORS[facility.type]}>
                {TYPE_LABELS[facility.type]}
              </Badge>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No facilities found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
