import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crime Categories — Brighton Hub',
  description:
    'Crime category breakdown for Brighton & Hove — detailed statistics by offence type across local postcode areas from Police.uk data.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
