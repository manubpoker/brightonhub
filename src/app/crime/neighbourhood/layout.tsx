import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neighbourhood Policing — Brighton Hub',
  description:
    'Neighbourhood policing information for Brighton & Hove — local policing teams, priorities, and community engagement details from Police.uk.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
