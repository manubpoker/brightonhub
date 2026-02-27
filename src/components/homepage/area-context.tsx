'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type AreaSelection = 'BN1' | 'BN2' | 'BN3' | 'ALL';

interface AreaContextValue {
  area: AreaSelection;
  setArea: (area: AreaSelection) => void;
}

const AreaContext = createContext<AreaContextValue | null>(null);

export function AreaProvider({ children }: { children: ReactNode }) {
  const [area, setArea] = useState<AreaSelection>('BN1');

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
