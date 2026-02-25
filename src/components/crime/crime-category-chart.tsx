'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CrimeCategoryCount } from '@/types/domain';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CATEGORY_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
  '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b',
  '#84cc16', '#06b6d4', '#a855f7', '#f43f5e',
];

interface CrimeCategoryChartProps {
  data: CrimeCategoryCount[];
  loading?: boolean;
}

export function CrimeCategoryChart({ data, loading }: CrimeCategoryChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crime by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Take top 10 categories for chart readability
  const chartData = data.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Crime by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 120, right: 20 }}>
            <XAxis type="number" fontSize={12} />
            <YAxis
              type="category"
              dataKey="category"
              fontSize={11}
              width={110}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip
              formatter={(value) => [`${value}`, 'Incidents']}
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
