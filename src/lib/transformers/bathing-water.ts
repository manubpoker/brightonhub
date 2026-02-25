import type { BathingWaterProfileResponse } from '@/types/api';
import type { BeachWaterQuality, BathingWaterOverview, Severity } from '@/types/domain';

function classificationToSeverity(classification: string): Severity {
  switch (classification.toLowerCase()) {
    case 'excellent':
      return 'normal';
    case 'good':
      return 'normal';
    case 'sufficient':
      return 'alert';
    case 'poor':
      return 'warning';
    case 'closed':
      return 'severe';
    default:
      return 'normal';
  }
}

function extractYearFromUrl(url: string): number {
  const match = url.match(/\/year\/(\d{4})/);
  return match ? parseInt(match[1], 10) : new Date().getFullYear();
}

function extractDateFromUrl(url: string): string | null {
  const match = url.match(/\/date\/(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function transformBathingWaterResponse(
  beachId: string,
  beachName: string,
  raw: BathingWaterProfileResponse
): BeachWaterQuality {
  const topic = raw.result.primaryTopic;

  const classification =
    topic.latestComplianceAssessment?.complianceClassification?.name?._value ?? 'Unknown';

  const sampleYear = topic.latestComplianceAssessment?._about
    ? extractYearFromUrl(topic.latestComplianceAssessment._about)
    : new Date().getFullYear();

  const lastSampleDate = topic.latestSampleAssessment?._about
    ? extractDateFromUrl(topic.latestSampleAssessment._about)
    : null;

  return {
    id: beachId,
    name: beachName,
    classification,
    sampleYear,
    lastSampleDate,
    severity: classificationToSeverity(classification),
  };
}

export function createBathingWaterOverview(beaches: BeachWaterQuality[]): BathingWaterOverview {
  const order: Record<Severity, number> = { severe: 0, warning: 1, alert: 2, normal: 3 };
  const worstSeverity = beaches.length > 0
    ? beaches.map((b) => b.severity).sort((a, b) => order[a] - order[b])[0]
    : 'normal';

  return { beaches, severity: worstSeverity };
}
