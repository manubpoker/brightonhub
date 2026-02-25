import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
}

export function PageHeader({ title, description, icon: Icon, iconColor }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-2">
        {Icon && <Icon className={cn('h-6 w-6', iconColor ?? 'text-gray-600')} />}
        {title}
      </h1>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
  );
}
