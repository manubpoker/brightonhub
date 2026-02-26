'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import type { School } from '@/types/domain';

interface SchoolListProps {
  schools: School[];
}

export function SchoolList({ schools }: SchoolListProps) {
  if (schools.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Schools ({schools.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {schools.map((school) => (
            <div
              key={school.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{school.name}</p>
                {school.address && (
                  <p className="text-xs text-muted-foreground">{school.address}</p>
                )}
                {school.operator && (
                  <p className="text-xs text-muted-foreground/70">{school.operator}</p>
                )}
              </div>
              {school.website && (
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/70 hover:text-muted-foreground ml-2 flex-shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
