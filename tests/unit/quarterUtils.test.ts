import {
  getQuarterFromMonth,
  getLastQuarter,
  getSeasonFromQuarter,
} from '../../src/utils/quarterUtils';

describe('getQuarterFromMonth', () => {
  it('returns Q1 for January, February, March (months 0-2)', () => {
    expect(getQuarterFromMonth(0)).toBe(1); // January
    expect(getQuarterFromMonth(1)).toBe(1); // February
    expect(getQuarterFromMonth(2)).toBe(1); // March
  });

  it('returns Q2 for April, May, June (months 3-5)', () => {
    expect(getQuarterFromMonth(3)).toBe(2); // April
    expect(getQuarterFromMonth(4)).toBe(2); // May
    expect(getQuarterFromMonth(5)).toBe(2); // June
  });

  it('returns Q3 for July, August, September (months 6-8)', () => {
    expect(getQuarterFromMonth(6)).toBe(3); // July
    expect(getQuarterFromMonth(7)).toBe(3); // August
    expect(getQuarterFromMonth(8)).toBe(3); // September
  });

  it('returns Q4 for October, November, December (months 9-11)', () => {
    expect(getQuarterFromMonth(9)).toBe(4);  // October
    expect(getQuarterFromMonth(10)).toBe(4); // November
    expect(getQuarterFromMonth(11)).toBe(4); // December
  });
});

describe('getLastQuarter', () => {
  it('returns Q4 when current month is in Q1', () => {
    expect(getLastQuarter(new Date(2024, 1, 1))).toBe(4); // February → Q1 → last = Q4
  });

  it('returns Q1 when current month is in Q2', () => {
    expect(getLastQuarter(new Date(2024, 4, 1))).toBe(1); // May → Q2 → last = Q1
  });

  it('returns Q2 when current month is in Q3', () => {
    expect(getLastQuarter(new Date(2024, 7, 1))).toBe(2); // August → Q3 → last = Q2
  });

  it('returns Q3 when current month is in Q4', () => {
    expect(getLastQuarter(new Date(2024, 10, 1))).toBe(3); // November → Q4 → last = Q3
  });
});

describe('getSeasonFromQuarter', () => {
  it('maps Q1 to Winter', () => {
    expect(getSeasonFromQuarter(1)).toBe('Winter');
  });

  it('maps Q2 to Spring', () => {
    expect(getSeasonFromQuarter(2)).toBe('Spring');
  });

  it('maps Q3 to Summer', () => {
    expect(getSeasonFromQuarter(3)).toBe('Summer');
  });

  it('maps Q4 to Fall', () => {
    expect(getSeasonFromQuarter(4)).toBe('Fall');
  });

  it('returns Unknown for out-of-range values', () => {
    expect(getSeasonFromQuarter(0)).toBe('Unknown');
    expect(getSeasonFromQuarter(5)).toBe('Unknown');
  });
});
