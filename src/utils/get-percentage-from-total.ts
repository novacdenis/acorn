export function getPercentageFromTotal(value: number, total: number): number {
  if (total === 0 && value === 0) return 100;
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
