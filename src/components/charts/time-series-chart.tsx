'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

interface TimeSeriesChartProps {
  title: string;
  data: TimeSeriesDataPoint[];
  unit: string;
  color?: string;
  loading?: boolean;
}

export function TimeSeriesChart({
  title,
  data,
  unit,
  color = '#3b82f6',
  loading,
}: TimeSeriesChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full rounded" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    time: format(new Date(d.timestamp), 'HH:mm'),
    value: d.value,
    fullTime: format(new Date(d.timestamp), 'dd MMM HH:mm'),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: unit,
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12 },
              }}
            />
            <Tooltip
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.fullTime ?? ''
              }
              formatter={(value) => [
                `${Number(value).toFixed(1)} ${unit}`,
                title,
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
