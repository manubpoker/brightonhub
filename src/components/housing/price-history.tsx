'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PropertyPriceData } from '@/types/domain';

interface PriceHistoryProps {
  history: PropertyPriceData[];
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `£${(price / 1_000_000).toFixed(2)}m`;
  if (price >= 1_000) return `£${Math.round(price / 1_000).toLocaleString()}k`;
  return `£${price}`;
}

export function PriceHistory({ history }: PriceHistoryProps) {
  if (history.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Price History (Last 12 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-gray-500">Period</th>
                <th className="text-right py-2 font-medium text-gray-500">Avg Price</th>
                <th className="text-right py-2 font-medium text-gray-500">Annual Change</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => {
                const change = row.annualChangePercent;
                return (
                  <tr key={row.period} className="border-b last:border-0">
                    <td className="py-2">
                      {new Date(row.period).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-2 text-right font-medium">
                      {formatPrice(row.averagePrice)}
                    </td>
                    <td
                      className={`py-2 text-right font-medium ${
                        change > 0
                          ? 'text-green-600'
                          : change < 0
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
