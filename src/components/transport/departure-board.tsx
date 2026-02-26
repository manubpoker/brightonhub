'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import type { TrainService } from '@/types/domain';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  'on-time': 'bg-green-100 text-green-700',
  delayed: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  'on-time': 'On Time',
  delayed: 'Delayed',
  cancelled: 'Cancelled',
};

interface DepartureBoardProps {
  departures: TrainService[];
  stationName: string;
  loading?: boolean;
}

export function DepartureBoard({ departures, stationName, loading }: DepartureBoardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Live Departures — {stationName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Live Departures — {stationName}</CardTitle>
      </CardHeader>
      <CardContent>
        {departures.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-muted-foreground">No departure information available at this time.</p>
            <a
              href="https://www.nationalrail.co.uk/live-trains/departures/BTN/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Check National Rail for live departures <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-4 font-medium">Time</th>
                  <th className="py-2 pr-4 font-medium">Destination</th>
                  <th className="py-2 pr-4 font-medium">Platform</th>
                  <th className="py-2 pr-4 font-medium">Expected</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {departures.map((service) => (
                  <tr key={service.serviceId} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 font-mono font-medium">
                      {service.scheduledTime}
                    </td>
                    <td className="py-2.5 pr-4">
                      {service.destination || <span className="text-muted-foreground/70 italic">Building...</span>}
                    </td>
                    <td className="py-2.5 pr-4 text-center">
                      {service.platform ?? '\u2014'}
                    </td>
                    <td className="py-2.5 pr-4 font-mono">
                      {service.status === 'cancelled'
                        ? '\u2014'
                        : service.expectedTime ?? service.scheduledTime}
                    </td>
                    <td className="py-2.5">
                      <Badge
                        className={cn(
                          'text-xs',
                          statusStyles[service.status] ?? statusStyles['on-time']
                        )}
                      >
                        {statusLabels[service.status] ?? service.status}
                        {service.status === 'delayed' && service.delayMinutes > 0 && (
                          <span className="ml-1">+{service.delayMinutes}m</span>
                        )}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
