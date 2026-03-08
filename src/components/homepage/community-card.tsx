'use client';

import Link from 'next/link';
import { HandHeart, ArrowRight, MapPin, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommunity } from '@/lib/hooks/use-community';
import { StatusDot } from './status-dot';

export function CommunityCard() {
  const { data, isLoading } = useCommunity();

  const nearest = data?.foodBanks?.[0];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <HandHeart className="h-4 w-4 text-purple-600" />
            Community
          </CardTitle>
          {data && <StatusDot severity={data.severity} />}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className="text-lg font-bold">{data.totalBanks}</div>
                <div className="text-[10px] text-muted-foreground">Food Banks</div>
              </div>
              <div className="rounded-lg border px-2 py-1.5 text-center">
                <div className="text-lg font-bold flex items-center justify-center gap-1">
                  {data.banksWithNeeds > 0 && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                  {data.banksWithNeeds}
                </div>
                <div className="text-[10px] text-muted-foreground">Need Donations</div>
              </div>
            </div>

            {nearest && (
              <div className="flex items-start gap-2.5 rounded-lg border px-3 py-2">
                <MapPin className="h-4 w-4 shrink-0 text-purple-500 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{nearest.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{nearest.address}</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">
            No community data available
          </div>
        )}

        <Link
          href="/community"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View community support <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
