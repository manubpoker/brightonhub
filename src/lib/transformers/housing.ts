import type { LandRegistrySparqlResponse } from '@/types/api';
import type { PropertyPriceData, HousingOverview, Severity } from '@/types/domain';

export type HousingData = HousingOverview;

function getHousingSeverity(annualChange: number): Severity {
  const abs = Math.abs(annualChange);
  if (abs > 15) return 'severe';
  if (abs > 10) return 'warning';
  if (abs > 5) return 'alert';
  return 'normal';
}

export function transformHousingResponse(raw: LandRegistrySparqlResponse): HousingData {
  const bindings = raw.results?.bindings ?? [];

  const history: PropertyPriceData[] = bindings.map((b) => ({
    period: b.period.value,
    averagePrice: parseFloat(b.averagePrice.value),
    annualChangePercent: b.annualChange ? parseFloat(b.annualChange.value) : 0,
  }));

  const current = history[0] ?? {
    period: 'N/A',
    averagePrice: 0,
    annualChangePercent: 0,
  };

  return {
    current,
    history,
    severity: getHousingSeverity(current.annualChangePercent),
  };
}
