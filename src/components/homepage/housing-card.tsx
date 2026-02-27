'use client';

import Link from 'next/link';
import { Home, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useHousing } from '@/lib/hooks/use-housing';
import { StatusDot } from './status-dot';
import { cn } from '@/lib/utils';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function HousingCard() {
  const { data, isLoading } = useHousing();

  const priceStr = data
    ? data.current.averagePrice >= 1000
      ? `£${Math.round(data.current.averagePrice / 1000)}k`
      : `£${data.current.averagePrice.toLocaleString()}`
    : null;

  const change = data?.current.annualChangePercent ?? 0;
  const isPositive = change >= 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Home className="h-4 w-4 text-teal-600" />
            Housing
          </CardTitle>
          {data && <StatusDot severity={data.severity} />}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : data ? (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className="text-lg font-bold">{priceStr}</div>
                <div className="text-[10px] text-muted-foreground">Avg price</div>
              </div>
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className={cn(
                  'flex items-center justify-center gap-0.5 text-lg font-bold',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {isPositive ? '+' : ''}{change.toFixed(1)}%
                </div>
                <div className="text-[10px] text-muted-foreground">Annual</div>
              </div>
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className="text-sm font-bold">{data.current.period}</div>
                <div className="text-[10px] text-muted-foreground">Period</div>
              </div>
            </div>

            {/* Sparkline */}
            {data.history.length > 1 && (
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.history}>
                    <Line
                      type="monotone"
                      dataKey="averagePrice"
                      stroke="var(--color-chart-2)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">
            No housing data available
          </div>
        )}

        <Link
          href="/housing"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View housing data <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
