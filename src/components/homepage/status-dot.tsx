'use client';

import { cn, getSeverityBgClass } from '@/lib/utils';
import type { Severity } from '@/types/domain';

interface StatusDotProps {
  severity: Severity;
  label?: string;
  className?: string;
}

export function StatusDot({ severity, label, className }: StatusDotProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'inline-block h-2 w-2 rounded-full',
          getSeverityBgClass(severity)
        )}
      />
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </span>
  );
}
