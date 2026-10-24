/** "May 5, 2026" → "2026-05-05", read in local time so it never shifts a day across timezones. */
export function isoDate(date: string): string {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
