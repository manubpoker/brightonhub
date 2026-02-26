import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Environment — Brighton Hub',
  description:
    'Environmental monitoring for Brighton & Hove — flood warnings, air quality, carbon intensity, and bathing water quality dashboards powered by live UK government data.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
