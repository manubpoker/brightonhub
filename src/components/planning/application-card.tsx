'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PlanningApplication } from '@/types/domain';
import { MapPin, Calendar } from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';

interface ApplicationCardProps {
  application: PlanningApplication;
}

const statusColors: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  refused: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  withdrawn: 'bg-gray-100 text-gray-700',
};

function getStatusColor(status: string): string {
  const lower = status.toLowerCase();
  for (const [key, value] of Object.entries(statusColors)) {
    if (lower.includes(key)) return value;
  }
  return 'bg-gray-100 text-gray-700';
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-gray-400">{application.reference}</span>
              <Badge className={getStatusColor(application.status)} variant="secondary">
                {application.status}
              </Badge>
            </div>
            <p className="text-sm font-medium mt-1.5 line-clamp-2">
              {application.description}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">{application.address}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
              <Calendar className="h-3 w-3 shrink-0" />
              <span>Submitted: {formatTimestamp(application.submissionDate)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
