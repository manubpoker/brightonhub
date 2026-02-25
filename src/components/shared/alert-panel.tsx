'use client';

import { AlertTriangle, Waves, Wind, Zap, Shield, Train, Landmark, HeartPulse, Home, GraduationCap, HandHeart, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { HazardAlert, HazardSource, Severity } from '@/types/domain';
import { cn, formatTimeAgo, getSeverityTextClass } from '@/lib/utils';

const sourceIcons: Record<HazardSource, typeof Waves> = {
  flood: Waves,
  'air-quality': Wind,
  carbon: Zap,
  crime: Shield,
  transport: Train,
  planning: Landmark,
  health: HeartPulse,
  housing: Home,
  schools: GraduationCap,
  community: HandHeart,
  entertainment: Ticket,
};

const severityBadgeVariant: Record<Severity, string> = {
  severe: 'bg-red-100 text-red-700 border-red-200',
  warning: 'bg-orange-100 text-orange-700 border-orange-200',
  alert: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  normal: 'bg-green-100 text-green-700 border-green-200',
};

interface AlertPanelProps {
  alerts: HazardAlert[];
  loading?: boolean;
}

export function AlertPanel({ alerts, loading }: AlertPanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const nonNormalAlerts = alerts.filter((a) => a.severity !== 'normal');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4" />
          Active Alerts
          {nonNormalAlerts.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {nonNormalAlerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nonNormalAlerts.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            No active alerts — all systems normal
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {nonNormalAlerts.map((alert) => {
              const Icon = sourceIcons[alert.source] ?? AlertTriangle;
              return (
                <div
                  key={alert.id}
                  className="flex gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 mt-0.5 shrink-0',
                      getSeverityTextClass(alert.severity)
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">
                        {alert.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          'shrink-0 text-xs capitalize',
                          severityBadgeVariant[alert.severity]
                        )}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {alert.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(alert.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
