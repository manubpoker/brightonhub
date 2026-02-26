import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community — Brighton Hub',
  description:
    'Community resources for Brighton & Hove — food banks, community centres, volunteer organisations, and local support services.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
