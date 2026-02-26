import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planning Applications — Brighton Hub',
  description:
    'Planning applications for Brighton & Hove — browse and search local planning submissions, statuses, and decision outcomes.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
