import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Weather — Brighton Hub',
  description:
    'Weather forecast for Brighton & Hove — current conditions, hourly breakdown, and 7-day forecast powered by Open-Meteo.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
