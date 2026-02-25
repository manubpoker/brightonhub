import type { LucideIcon } from 'lucide-react';
import type { Severity } from './domain';

export type DashboardId = 'environment' | 'crime' | 'transport' | 'planning' | 'weather' | 'health' | 'housing' | 'schools' | 'community' | 'entertainment';

export interface DashboardConfig {
  id: DashboardId;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string; // Tailwind text color class
  bgColor: string; // Tailwind bg color class
  available: boolean;
}

export interface DashboardStatus {
  dashboardId: DashboardId;
  severity: Severity;
  summary: string;
  lastUpdated: string | null;
}
