'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Waves, Leaf, Shield, Train, Landmark, CloudSun, HeartPulse, Home, GraduationCap, HandHeart, Ticket, BookOpen, Info, Menu, X, Construction } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { SearchPalette } from '@/components/homepage/search-palette';
import { useArea, type AreaSelection } from '@/components/homepage/area-context';
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

const areas: { value: AreaSelection; label: string }[] = [
  { value: 'BN1', label: 'BN1' },
  { value: 'BN2', label: 'BN2' },
  { value: 'BN3', label: 'BN3' },
  { value: 'BN41', label: 'BN41' },
  { value: 'BN42', label: 'BN42' },
  { value: 'BN43', label: 'BN43' },
  { value: 'ALL', label: 'All' },
];

function HomeHeader() {
  const pathname = usePathname();
  const { area, setArea } = useArea();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Row 1: Logo, Search, Theme toggle */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Waves className="h-6 w-6" style={{ color: 'var(--accent-brighton)' }} />
          <span className="text-lg font-semibold">BrightonHub</span>
        </Link>

        <div className="flex-1 flex justify-center max-w-sm mx-auto">
          <SearchPalette />
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded-md hover:bg-accent lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Row 2: Desktop nav links */}
      <nav className="hidden lg:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {navItems.map(({ href, label, icon: Icon, underConstruction }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
                isActive(href)
                  ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {underConstruction && <Construction className="h-3 w-3 text-amber-500" />}
            </Link>
          ))}
        </div>
      </nav>

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
              aria-current={isActive(href) ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" />
              {label}
              {underConstruction && <Construction className="h-3 w-3 text-amber-500" />}
            </Link>
          ))}
        </nav>
      )}

      {/* Row 3: Area selector pills */}
      <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {areas.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setArea(value)}
              aria-pressed={area === value}
              aria-label={`Filter data by ${value === 'ALL' ? 'all areas' : value}`}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap',
                area === value
                  ? 'text-white ring-1 ring-offset-1 ring-offset-background'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
              style={area === value ? { backgroundColor: 'var(--accent-brighton)' } : undefined}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function SubPageHeader() {
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
          <Waves className="h-6 w-6" style={{ color: 'var(--accent-brighton)' }} />
          <span className="text-lg font-semibold">BrightonHub</span>
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
                aria-current={isActive(href) ? 'page' : undefined}
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
              aria-current={isActive(href) ? 'page' : undefined}
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

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (isHome) return <HomeHeader />;
  return <SubPageHeader />;
}
