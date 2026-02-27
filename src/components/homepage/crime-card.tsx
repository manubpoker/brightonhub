'use client';

import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCrime } from '@/lib/hooks/use-crime';
import { CRIME_CATEGORY_LABELS } from '@/lib/constants';
import { StatusDot } from './status-dot';
import { useArea } from './area-context';

export function CrimeCard() {
  const { data, isLoading } = useCrime();
  const { area } = useArea();

  const summary = data?.summary;
  const topCategories = summary?.categories
    ?.slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 4) ?? [];

  const totalCrimes = summary?.totalCrimes ?? 0;
  const topCategoryPct = topCategories.length > 0 && totalCrimes > 0
    ? ((topCategories[0].count / totalCrimes) * 100).toFixed(0)
    : '0';

  const areaCount = area === 'ALL'
    ? totalCrimes
    : summary?.areaBreakdown?.find((a) => a.area === area)?.count ?? 0;

  const maxCount = topCategories.length > 0 ? topCategories[0].count : 1;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-blue-600" />
            Crime &amp; Safety
          </CardTitle>
          {summary && <StatusDot severity={summary.severity} />}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : summary ? (
          <>
            {/* Stat boxes */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className="text-lg font-bold">{totalCrimes.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">Total</div>
              </div>
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className="text-lg font-bold">{topCategoryPct}%</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {CRIME_CATEGORY_LABELS[topCategories[0]?.category] ?? topCategories[0]?.category ?? 'Top'}
                </div>
              </div>
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className="text-lg font-bold">{areaCount.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">
                  {area === 'ALL' ? 'All areas' : `In ${area}`}
                </div>
              </div>
            </div>

            {/* CSS bar chart */}
            <div className="space-y-1.5">
              {topCategories.map((cat) => {
                const pct = ((cat.count / maxCount) * 100).toFixed(0);
                const label = CRIME_CATEGORY_LABELS[cat.category] ?? cat.category;
                return (
                  <div key={cat.category} className="flex items-center gap-2 text-xs">
                    <span className="w-24 truncate text-muted-foreground">{label}</span>
                    <div className="flex-1 h-3.5 rounded-sm bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-sm bg-blue-500/70 dark:bg-blue-400/60 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right tabular-nums text-muted-foreground">
                      {((cat.count / totalCrimes) * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">
            No crime data available
          </div>
        )}

        <Link
          href="/crime"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View crime map <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
