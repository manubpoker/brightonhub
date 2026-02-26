import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Housing & Property — Brighton Hub',
  description:
    'Housing and property market data for Brighton & Hove — house prices, transaction volumes, and market trends from HM Land Registry.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
