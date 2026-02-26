import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Brighton Hub',
  description:
    'About Brighton Hub — learn how this civic data platform aggregates real-time UK government data for Brighton & Hove residents and visitors.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
