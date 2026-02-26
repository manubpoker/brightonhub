import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flood Monitoring — Brighton Hub',
  description:
    'Flood warnings and river level monitoring for Brighton & Hove — live alerts, station readings, and severity levels from the Environment Agency.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
