'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { GenerationMixEntry } from '@/types/domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const FUEL_COLORS: Record<string, string> = {
  wind: '#22c55e',
  solar: '#eab308',
  nuclear: '#8b5cf6',
  gas: '#ef4444',
  coal: '#1f2937',
  hydro: '#3b82f6',
  biomass: '#84cc16',
  imports: '#6b7280',
  other: '#9ca3af',
};

interface GenerationMixChartProps {
  data: GenerationMixEntry[];
  loading?: boolean;
}

export function GenerationMixChart({ data, loading }: GenerationMixChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generation Mix</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full rounded" />
        </CardContent>
      </Card>
    );
  }

  // Filter out zero values and sort by percentage
  const chartData = data
    .filter((d) => d.perc > 0)
    .sort((a, b) => b.perc - a.perc)
    .map((d) => ({
      name: d.fuel.charAt(0).toUpperCase() + d.fuel.slice(1),
      value: d.perc,
      fuel: d.fuel,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Generation Mix</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.fuel}
                  fill={FUEL_COLORS[entry.fuel] ?? FUEL_COLORS.other}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Share']}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
