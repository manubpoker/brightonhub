'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  /** Query keys to invalidate. Omit to refetch all active queries on the page. */
  queryKeys?: readonly (string | readonly unknown[])[];
  label?: string;
  className?: string;
}

export function RefreshButton({
  queryKeys,
  label = 'Refresh',
  className,
}: RefreshButtonProps) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    try {
      if (queryKeys && queryKeys.length > 0) {
        await Promise.all(
          queryKeys.map((key) =>
            queryClient.invalidateQueries({
              queryKey: Array.isArray(key) ? (key as unknown[]) : [key],
            })
          )
        );
      } else {
        await queryClient.invalidateQueries({ type: 'active' });
      }
      setLastRefreshedAt(new Date());
    } finally {
      setBusy(false);
    }
  }

  const timeLabel = lastRefreshedAt
    ? lastRefreshedAt.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={label}
      title={timeLabel ? `${label} — last refreshed ${timeLabel}` : label}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        className
      )}
    >
      <RefreshCw
        className={cn('h-3.5 w-3.5', busy && 'animate-spin')}
        aria-hidden="true"
      />
      <span className="hidden sm:inline">{busy ? 'Refreshing…' : label}</span>
    </button>
  );
}
