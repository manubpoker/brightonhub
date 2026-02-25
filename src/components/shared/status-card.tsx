'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Severity } from '@/types/domain';
import { cn, getSeverityBorderClass, getSeverityTextClass } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  icon: LucideIcon;
  severity: Severity;
  value: string;
  subtitle: string;
  loading?: boolean;
  error?: boolean;
  href?: string;
}

export function StatusCard({
  title,
  icon: Icon,
  severity,
  value,
  subtitle,
  loading,
  error,
}: StatusCardProps) {
  if (loading) {
    return (
      <Card className="min-w-[200px]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-24 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="min-w-[200px] border-gray-300">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">{title}</span>
          </div>
          <p className="text-lg font-semibold text-gray-400">Unavailable</p>
          <p className="text-xs text-gray-400">Data source offline</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'min-w-[200px] border-l-4 transition-shadow hover:shadow-md',
        getSeverityBorderClass(severity)
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={cn('h-4 w-4', getSeverityTextClass(severity))} />
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        <p
          className={cn(
            'text-xl font-bold',
            getSeverityTextClass(severity)
          )}
        >
          {value}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
