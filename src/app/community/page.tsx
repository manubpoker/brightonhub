'use client';

import { useCommunity } from '@/lib/hooks/use-community';
import { ErrorState } from '@/components/shared/error-state';
import { CommunitySummary } from '@/components/community/community-summary';
import { FoodBankList } from '@/components/community/food-bank-list';
import { CommunityMap } from '@/components/community/community-map';
import { Card, CardContent } from '@/components/ui/card';

export default function CommunityPage() {
  const { data, isLoading, isError } = useCommunity();

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Community & Food Banks</h1>
        <ErrorState message="Unable to load community data. Please try again later." />
      </div>
    );
  }

  const banksWithLocation = data?.foodBanks.filter((fb) => fb.location.lat !== 0) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Community & Food Banks</h1>
        <p className="text-gray-500 mt-1">
          Food banks, urgent needs, and community support near Brighton & Hove
        </p>
      </div>

      <CommunitySummary data={data} isLoading={isLoading} />

      {banksWithLocation.length > 0 && (
        <CommunityMap
          foodBanks={data!.foodBanks}
          className="h-[400px] lg:h-[500px] rounded-lg overflow-hidden border"
        />
      )}

      {data && data.foodBanks.length > 0 && (
        <FoodBankList foodBanks={data.foodBanks} />
      )}

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500">
            Food bank data is sourced from{' '}
            <a
              href="https://www.givefood.org.uk/"
              className="underline hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Give Food
            </a>
            , a UK food bank data project. Needs are updated frequently as food banks report
            their current requirements. If you can help, please contact the food bank directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
