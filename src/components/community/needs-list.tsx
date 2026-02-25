'use client';

import { Badge } from '@/components/ui/badge';

interface NeedsListProps {
  needs: string[];
}

export function NeedsList({ needs }: NeedsListProps) {
  if (needs.length === 0) {
    return <p className="text-xs text-gray-400">No current needs listed</p>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {needs.map((need, i) => (
        <Badge key={i} variant="secondary" className="text-xs">
          {need}
        </Badge>
      ))}
    </div>
  );
}
