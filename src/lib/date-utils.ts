/** Returns YYYY-MM-DD for a date in Europe/London timezone (server-side safe) */
export function getUKDateString(date: Date = new Date()): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'Europe/London' });
}

/** Returns YYYY-MM-DD offset by N days in Europe/London timezone */
export function getUKDateStringOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return getUKDateString(d);
}

/** Returns YYYY-MM-DD in the browser's local timezone (client-side) */
export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
