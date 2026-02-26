import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schools & Education — Brighton Hub',
  description:
    'Schools and education information for Brighton & Hove — primary schools, secondary schools, colleges, and educational facilities across the city.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
