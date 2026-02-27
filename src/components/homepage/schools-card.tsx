'use client';

import Link from 'next/link';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSchools } from '@/lib/hooks/use-schools';
import { StatusDot } from './status-dot';

export function SchoolsCard() {
  const { data, isLoading } = useSchools();

  const primaryCount = data?.schools.filter((s) =>
    s.type.toLowerCase().includes('primary')
  ).length ?? 0;

  const secondaryCount = data?.schools.filter((s) =>
    s.type.toLowerCase().includes('secondary')
  ).length ?? 0;

  const otherCount = data ? data.totalCount - primaryCount - secondaryCount : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-4 w-4 text-violet-600" />
            Schools
          </CardTitle>
          <StatusDot severity="normal" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : data ? (
          <>
            <div className="rounded-lg border px-3 py-2 text-center">
              <div className="text-2xl font-bold">{data.totalCount}</div>
              <div className="text-xs text-muted-foreground">Schools in Brighton &amp; Hove</div>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span>{primaryCount} primary</span>
              <span className="text-border">|</span>
              <span>{secondaryCount} secondary</span>
              {otherCount > 0 && (
                <>
                  <span className="text-border">|</span>
                  <span>{otherCount} other</span>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">
            No schools data available
          </div>
        )}

        <Link
          href="/schools"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View all schools <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
