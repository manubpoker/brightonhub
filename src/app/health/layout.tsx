import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health & NHS — Brighton Hub',
  description:
    'Health and NHS service data for Brighton & Hove — GP surgeries, hospitals, pharmacies, and healthcare facilities from the NHS Organisation Data Service.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
