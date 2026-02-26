import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crime & Safety — Brighton Hub',
  description:
    'Crime and safety data for Brighton & Hove — neighbourhood crime statistics, category breakdowns, and policing information across BN1 to BN43 postcode areas.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
