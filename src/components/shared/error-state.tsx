'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Unable to load data',
  message = 'Please try again later.',
  retryLabel = 'Try again',
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="py-4">
      <CardContent className="text-center">
        <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-lg font-medium text-foreground">{title}</p>
        <p className="text-muted-foreground mt-1">{message}</p>
        <button
          type="button"
          onClick={() => onRetry?.() ?? window.location.reload()}
          className="mt-4 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-accent"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {retryLabel}
        </button>
      </CardContent>
    </Card>
  );
}
