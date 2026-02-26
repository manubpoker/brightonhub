import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bus Services — Brighton Hub',
  description:
    'Bus service information for Brighton & Hove — routes, timetables, and service updates for local and regional bus operators.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
