'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Leaf, Shield, Train, Landmark, CloudSun, HeartPulse, Home, GraduationCap, HandHeart, Ticket, BookOpen, Info, Menu, X, Construction } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  underConstruction?: boolean;
}

const navItems: NavItem[] = [
  { href: '/environment', label: 'Environment', icon: Leaf },
  { href: '/weather', label: 'Weather', icon: CloudSun },
  { href: '/crime', label: 'Crime', icon: Shield },
  { href: '/transport', label: 'Transport', icon: Train },
  { href: '/planning', label: 'Planning', icon: Landmark },
  { href: '/health', label: 'Health', icon: HeartPulse },
  { href: '/housing', label: 'Housing', icon: Home },
  { href: '/schools', label: 'Schools', icon: GraduationCap },
  { href: '/community', label: 'Community', icon: HandHeart },
  { href: '/entertainment', label: 'Events', icon: Ticket },
  { href: '/students', label: 'Students', icon: BookOpen },
  { href: '/about', label: 'About', icon: Info },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-green-600" />
          <span className="text-lg font-semibold">Brighton Hub</span>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            BN1
          </Badge>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map(({ href, label, icon: Icon, underConstruction }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                isActive(href)
                  ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {underConstruction && <Construction className="h-3 w-3 text-amber-500" />}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            className="p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t bg-background px-4 pb-4 pt-2">
          {navItems.map(({ href, label, icon: Icon, underConstruction }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(href)
                  ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {underConstruction && <Construction className="h-3 w-3 text-amber-500" />}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
