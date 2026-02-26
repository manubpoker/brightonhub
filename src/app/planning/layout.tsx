import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planning & Development — Brighton Hub',
  description:
    'Planning and development data for Brighton & Hove — local planning applications, development proposals, and decision notices from DLUHC Planning Data.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
