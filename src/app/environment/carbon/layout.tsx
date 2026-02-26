import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carbon Intensity — Brighton Hub',
  description:
    'Real-time carbon intensity data for Brighton & Hove — current grid intensity, generation mix, and forecast from the National Grid Carbon Intensity API.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
