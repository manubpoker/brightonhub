import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transport — Brighton Hub',
  description:
    'Transport information for Brighton & Hove — live train departures, bus services, and travel updates for the city and surrounding areas.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
