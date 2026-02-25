import { Card, CardContent } from '@/components/ui/card';
import { Bus } from 'lucide-react';

export default function BusesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bus Services</h1>
        <p className="text-gray-500 mt-1">
          Real-time bus service information for Brighton & Hove
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-600">Coming Soon</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Bus service data integration is planned for a future update.
            This will include real-time arrivals and service disruption information
            via the Bus Open Data Service (BODS).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
