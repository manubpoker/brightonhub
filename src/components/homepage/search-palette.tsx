'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { DASHBOARDS } from '@/lib/dashboards';
import { cn } from '@/lib/utils';

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = DASHBOARDS.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      handleClose();
      router.push(href);
    },
    [handleClose, router]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) handleClose();
        else handleOpen();
      }
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, handleOpen, handleClose]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-expanded={open}
        aria-controls="search-palette-dialog"
        aria-label="Open dashboard search"
        className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent w-full max-w-xs sm:max-w-sm"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Search Brighton Hub...</span>
        <span className="sm:hidden">Search...</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search Brighton Hub dashboards"
            id="search-palette-dialog"
            className="relative z-10 w-full max-w-lg rounded-xl border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                aria-label="Search Brighton Hub dashboards"
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                role="combobox"
                aria-expanded={filtered.length > 0}
                aria-controls="search-palette-results"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === 'Enter' && filtered[selectedIndex]) {
                    handleSelect(filtered[selectedIndex].href);
                  }
                }}
                placeholder="Search dashboards..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={handleClose}
                className="rounded p-1 hover:bg-accent"
                aria-label="Close search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2" id="search-palette-results" role="listbox">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No dashboards found.
                </p>
              ) : (
                filtered.map((d, i) => {
                  const Icon = d.icon;
                  return (
                      <button
                      key={d.id}
                      onClick={() => handleSelect(d.href)}
                      role="option"
                      aria-selected={i === selectedIndex}
                      type="button"
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                        i === selectedIndex
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground hover:bg-accent/50'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', d.color)} />
                      <div>
                        <div className="font-medium">{d.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {d.description}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
