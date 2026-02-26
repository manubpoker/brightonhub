import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Train Departures — Brighton Hub',
  description:
    'Live train departures from Brighton station — real-time departure board, platform information, and service status via National Rail Darwin Push Port.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
