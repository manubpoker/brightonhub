'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DashboardConfig } from '@/types/dashboard';
import type { Severity } from '@/types/domain';
import { cn, getSeverityBgClass } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface DashboardCardProps {
  config: DashboardConfig;
  severity?: Severity;
  summary?: string;
  lastUpdated?: string | null;
}

export function DashboardCard({
  config,
  severity = 'normal',
  summary,
  lastUpdated,
}: DashboardCardProps) {
  const Icon = config.icon;

  if (!config.available) {
    return (
      <Card className="opacity-50 cursor-default">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn('rounded-lg p-2.5', config.bgColor)}>
              <Icon className={cn('h-6 w-6', config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-400">{config.title}</h3>
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-300">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mt-1">{config.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={config.href}>
      <Card className="transition-all hover:shadow-md hover:border-gray-300 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn('rounded-lg p-2.5', config.bgColor)}>
              <Icon className={cn('h-6 w-6', config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{config.title}</h3>
                <span
                  className={cn(
                    'inline-block h-2.5 w-2.5 rounded-full',
                    getSeverityBgClass(severity)
                  )}
                  title={severity}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {summary ?? config.description}
              </p>
              {lastUpdated && (
                <p className="text-xs text-gray-400 mt-2">Updated {lastUpdated}</p>
              )}
            </div>
            <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
