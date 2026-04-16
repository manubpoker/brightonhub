import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, Home } from 'lucide-react';
import { DASHBOARDS } from '@/lib/dashboards';

export const metadata: Metadata = {
  title: 'Page not found — Brighton Hub',
  description: 'The page you were looking for on Brighton Hub could not be found.',
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <Compass className="h-14 w-14 text-muted-foreground/60 mx-auto mb-4" />
        <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          The page you were looking for doesn&apos;t exist — it may have moved,
          been renamed, or never existed. Try one of the dashboards below.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium mt-6 hover:bg-accent transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Brighton Hub
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DASHBOARDS.map((d) => {
          const Icon = d.icon;
          return (
            <Link key={d.id} href={d.href}>
              <Card className="hover:border-foreground/20 transition-colors h-full">
                <CardContent className="p-4 flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${d.color}`} />
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{d.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {d.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
