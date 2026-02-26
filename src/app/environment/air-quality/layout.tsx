import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Air Quality — Brighton Hub',
  description:
    'Live air quality monitoring for Brighton & Hove — DAQI index, pollutant levels, and health advice from DEFRA UK-AIR monitoring stations.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
