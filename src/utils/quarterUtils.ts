const SEASONS: Record<number, string> = {
  1: 'Winter',
  2: 'Spring',
  3: 'Summer',
  4: 'Fall',
};

/**
 * Derive the fiscal quarter (1–4) from a zero-indexed month number.
 * Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
 */
export function getQuarterFromMonth(month: number): number {
  return Math.floor(month / 3) + 1;
}

/**
 * Return the fiscal quarter that preceded the current quarter.
 * Wraps from Q1 back to Q4 of the previous year's context.
 */
export function getLastQuarter(date: Date): number {
  const current = getQuarterFromMonth(date.getMonth());
  return current === 1 ? 4 : current - 1;
}

/**
 * Map a quarter number (1–4) to its corresponding season name.
 * Returns 'Unknown' for out-of-range values.
 */
export function getSeasonFromQuarter(quarter: number): string {
  return SEASONS[quarter] ?? 'Unknown';
}
