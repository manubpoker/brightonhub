'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AreaSelection = 'BN1' | 'BN2' | 'BN3' | 'BN41' | 'BN42' | 'BN43' | 'ALL';
const AREA_STORAGE_KEY = 'brightonhub_area';

interface AreaContextValue {
  area: AreaSelection;
  setArea: (area: AreaSelection) => void;
}

function isAreaSelection(value: string | null): value is AreaSelection {
  return value === 'BN1' || value === 'BN2' || value === 'BN3' || value === 'BN41' || value === 'BN42' || value === 'BN43' || value === 'ALL';
}

const AreaContext = createContext<AreaContextValue | null>(null);

export function AreaProvider({ children }: { children: ReactNode }) {
  const [area, setArea] = useState<AreaSelection>(() => {
    if (typeof window === 'undefined') return 'BN1';
    const saved = window.localStorage.getItem(AREA_STORAGE_KEY);
    return isAreaSelection(saved) ? saved : 'BN1';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(AREA_STORAGE_KEY, area);
  }, [area]);

  return (
    <AreaContext.Provider value={{ area, setArea }}>
      {children}
    </AreaContext.Provider>
  );
}

const defaultValue: AreaContextValue = { area: 'BN1', setArea: () => {} };

export function useArea() {
  const ctx = useContext(AreaContext);
  return ctx ?? defaultValue;
}
