'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { useFlood } from '@/lib/hooks/use-flood';

export function AlertBanner() {
  const { data } = useFlood();

  if (!data) return null;

  const activeCount = data.warnings.filter((w) => w.severity !== 'normal').length;

  if (activeCount === 0) return null;

  return (
    <div
      className="w-full px-4 py-2.5 text-white"
      style={{ backgroundColor: 'var(--accent-brighton)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            {activeCount} active flood warning{activeCount > 1 ? 's' : ''} in the Brighton area
          </span>
        </div>
        <Link
          href="/environment/flood"
          className="shrink-0 rounded-md bg-white/20 px-3 py-1 text-xs font-medium transition-colors hover:bg-white/30"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
