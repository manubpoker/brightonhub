'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Phone, Mail } from 'lucide-react';
import { NeedsList } from './needs-list';
import type { FoodBank } from '@/types/domain';

interface FoodBankListProps {
  foodBanks: FoodBank[];
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function FoodBankList({ foodBanks }: FoodBankListProps) {
  if (foodBanks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Food Banks ({foodBanks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {foodBanks.map((fb) => (
            <div key={fb.id} className="rounded-lg border p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{fb.name}</p>
                  <p className="text-xs text-muted-foreground">{fb.address}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {fb.distance_m > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {formatDistance(fb.distance_m)}
                    </Badge>
                  )}
                  {fb.hasNeeds && (
                    <Badge className="bg-orange-100 text-orange-700 text-xs">
                      Needs items
                    </Badge>
                  )}
                </div>
              </div>
              {fb.hasNeeds && <NeedsList needs={fb.needs} />}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {fb.phone && (
                  <a href={`tel:${fb.phone}`} className="flex items-center gap-1 hover:text-foreground">
                    <Phone className="h-3 w-3" />
                    {fb.phone}
                  </a>
                )}
                {fb.email && (
                  <a href={`mailto:${fb.email}`} className="flex items-center gap-1 hover:text-foreground">
                    <Mail className="h-3 w-3" />
                    {fb.email}
                  </a>
                )}
                {fb.website && (
                  <a
                    href={fb.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
