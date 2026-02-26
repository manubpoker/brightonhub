import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entertainment & Events — Brighton Hub',
  description:
    'Entertainment and events in Brighton & Hove — upcoming gigs, festivals, theatre, comedy, and local events powered by the Skiddle Events API.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
