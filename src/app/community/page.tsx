'use client';

import { useCommunity } from '@/lib/hooks/use-community';
import { ErrorState } from '@/components/shared/error-state';
import { CommunitySummary } from '@/components/community/community-summary';
import { FoodBankList } from '@/components/community/food-bank-list';
import { CommunityMap } from '@/components/community/community-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, BookOpen, ExternalLink } from 'lucide-react';

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
        <p className="text-muted-foreground mt-1">
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

      {/* Understanding Community Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            Understanding Community Support in Brighton
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Brighton &amp; Hove has an active network of food banks, community fridges, and emergency
            support services. Data on this page comes from <strong>Give Food</strong>, a UK-wide food bank
            data project that tracks both Trussell Trust and independent food banks.
          </p>
          <p>
            The <strong>Brighton &amp; Hove Food Partnership</strong> coordinates local food poverty
            initiatives, including community fridges that redistribute surplus food from supermarkets
            and restaurants. These are available to everyone — no referral needed.
          </p>
          <p>
            If you need urgent help, most food banks accept self-referrals or referrals from GPs,
            schools, and support agencies. The <strong>Household Support Fund</strong> (administered by
            the council) also provides emergency grants for food, energy, and essentials.
          </p>
        </CardContent>
      </Card>

      {/* Key Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-purple-500" />
            Key Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { term: 'Trussell Trust', definition: 'The UK\'s largest food bank network — provides emergency food parcels based on referral vouchers' },
              { term: 'Independent Food Bank', definition: 'A food bank not part of the Trussell Trust network, often with different referral policies' },
              { term: 'Urgent Needs', definition: 'Items a food bank is currently short of and requesting donations for' },
              { term: 'Community Fridge', definition: 'A shared fridge where surplus food is available for free — open to everyone, no referral required' },
              { term: 'Household Support Fund', definition: 'Government-funded grant administered by councils for emergency help with food, energy, and essentials' },
            ].map(({ term, definition }) => (
              <div key={term} className="rounded-lg border p-3">
                <Badge variant="secondary" className="text-xs mb-1">{term}</Badge>
                <p className="text-xs text-muted-foreground">{definition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Useful Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ExternalLink className="h-4 w-4 text-green-600" />
            Useful Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Give Food — Brighton', url: 'https://www.givefood.org.uk/needs/in/brighton-and-hove/' },
              { label: 'Brighton & Hove Food Partnership', url: 'https://bhfood.org.uk/' },
              { label: 'Cost of Living Support', url: 'https://www.brighton-hove.gov.uk/cost-living-support' },
              { label: 'Trussell Trust', url: 'https://www.trusselltrust.org/' },
              { label: 'Citizens Advice — Brighton', url: 'https://www.citizensadvice.org.uk/' },
              { label: 'Check Benefits Entitlement', url: 'https://www.gov.uk/check-benefits-financial-support' },
              { label: 'MoneyHelper', url: 'https://www.moneyhelper.org.uk/' },
            ].map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-3 text-sm text-blue-600 hover:bg-accent transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            Food bank data is sourced from{' '}
            <a
              href="https://www.givefood.org.uk/"
              className="underline hover:text-foreground"
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
