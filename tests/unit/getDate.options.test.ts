/**
 * Unit tests — one describe block per supported option.
 *
 * The system clock is frozen to a known reference date so that
 * every assertion uses deterministic expected values:
 *
 *   Reference: March 15, 2024  (2024 is a leap year)
 *   ├─ month (0-indexed): 2   → March   → Q1   → Winter
 *   ├─ lastMonth:             → February
 *   ├─ day:                   → 15
 *   ├─ year:                  → 2024  (two-digit: "24")
 *   ├─ lastYear:              → 2023
 *   └─ nextYear:              → 2025
 */

import { getDate } from '../../src/getDate';

// ── Clock fixture ──────────────────────────────────────────────────────────────
const FIXED = new Date(2024, 2, 15); // March 15 2024

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(FIXED);
});

afterEach(() => {
  jest.useRealTimers();
});

// ── Helper ────────────────────────────────────────────────────────────────────
// All calls use silent: true so tests don't produce console noise.
const s = { silent: true };

// ═════════════════════════════════════════════════════════════════════════════
// Default (no options)
// ═════════════════════════════════════════════════════════════════════════════
describe('default call (no options)', () => {
  it('sets date as MM-DD-YY', () => {
    expect(getDate(s).date).toBe('03-15-24');
  });

  it('sets twoDigitDate as YY', () => {
    expect(getDate(s).twoDigitDate).toBe('24');
  });

  it('sets lastMonth to the previous month name', () => {
    expect(getDate(s).lastMonth).toBe('February');
  });

  it('sets month to the current month name', () => {
    expect(getDate(s).month).toBe('March');
  });

  it('sets quarter to the current fiscal quarter number', () => {
    expect(getDate(s).quarter).toBe(1);
  });

  it('sets year to the four-digit current year', () => {
    expect(getDate(s).year).toBe('2024');
  });

  it('does not set fullDate', () => {
    expect(getDate(s).fullDate).toBeUndefined();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// --full
// ═════════════════════════════════════════════════════════════════════════════
describe('--full option', () => {
  it('stores the date in fullDate with a four-digit year', () => {
    const r = getDate({ ...s, full: true });
    expect(r.fullDate).toBe('03-15-2024');
  });

  it('does not populate the date field', () => {
    const r = getDate({ ...s, full: true });
    expect(r.date).toBeUndefined();
  });

  it('still populates secondary default variables', () => {
    const r = getDate({ ...s, full: true });
    expect(r.month).toBe('March');
    expect(r.year).toBe('2024');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// --slash
// ═════════════════════════════════════════════════════════════════════════════
describe('--slash option', () => {
  it('stores the date with forward-slash separator in date', () => {
    const r = getDate({ ...s, slash: true });
    expect(r.date).toBe('03/15/24');
  });

  it('combined with alternateVar stores result in slashDate', () => {
    const r = getDate({ ...s, slash: true, alternateVar: true });
    expect(r.slashDate).toBe('03/15/24');
    expect(r.date).toBeUndefined();
  });

  it('combined with customVar stores result under that key', () => {
    const r = getDate({ ...s, slash: true, customVar: '_myDate' });
    expect(r['_myDate']).toBe('03/15/24');
    expect(r.date).toBeUndefined();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /D — day
// ═════════════════════════════════════════════════════════════════════════════
describe('/D — day option', () => {
  it('sets day as two-digit string', () => {
    expect(getDate({ ...s, day: true }).day).toBe('15');
  });

  it('also sets date as MM-DD-YY', () => {
    expect(getDate({ ...s, day: true }).date).toBe('03-15-24');
  });

  it('does not set monthNumber when dayMonth is false', () => {
    expect(getDate({ ...s, day: true }).monthNumber).toBeUndefined();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /DM — dayMonth (requires day)
// ═════════════════════════════════════════════════════════════════════════════
describe('/DM — dayMonth option', () => {
  it('sets monthNumber as two-digit string when combined with day', () => {
    const r = getDate({ ...s, day: true, dayMonth: true });
    expect(r.monthNumber).toBe('03');
  });

  it('has no effect without day option', () => {
    const r = getDate({ ...s, dayMonth: true });
    expect(r.monthNumber).toBeUndefined();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /LM — lastMonth
// ═════════════════════════════════════════════════════════════════════════════
describe('/LM — lastMonth option', () => {
  it('returns the full name of last month', () => {
    expect(getDate({ ...s, lastMonth: true }).lastMonth).toBe('February');
  });

  it('returns abbreviated name when abbreviated is true', () => {
    expect(getDate({ ...s, lastMonth: true, abbreviated: true }).lastMonth).toBe('Feb');
  });

  it('wraps from January to December', () => {
    jest.setSystemTime(new Date(2024, 0, 10)); // January
    expect(getDate({ ...s, lastMonth: true }).lastMonth).toBe('December');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /LQ — lastQuarter (independent)
// ═════════════════════════════════════════════════════════════════════════════
describe('/LQ — lastQuarter option (independent)', () => {
  it('returns the last fiscal quarter number', () => {
    // March 2024 → Q1 → last quarter = Q4
    expect(getDate({ ...s, lastQuarter: true }).lastQuarter).toBe(4);
  });

  it('is independent — ignores other component options', () => {
    const r = getDate({ ...s, lastQuarter: true, month: true, year: true });
    expect(r.lastQuarter).toBe(4);
    expect(r.month).toBeUndefined();
    expect(r.year).toBeUndefined();
  });

  it('returns Q3 for a Q4 month', () => {
    jest.setSystemTime(new Date(2024, 10, 1)); // November → Q4
    expect(getDate({ ...s, lastQuarter: true }).lastQuarter).toBe(3);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /LY — lastYear
// ═════════════════════════════════════════════════════════════════════════════
describe('/LY — lastYear option', () => {
  it('returns the four-digit year of last year', () => {
    expect(getDate({ ...s, lastYear: true }).lastYear).toBe('2023');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /M — month
// ═════════════════════════════════════════════════════════════════════════════
describe('/M — month option', () => {
  it('returns the full name of the current month', () => {
    expect(getDate({ ...s, month: true }).month).toBe('March');
  });

  it('returns abbreviated name when abbreviated is true', () => {
    expect(getDate({ ...s, month: true, abbreviated: true }).month).toBe('Mar');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /NY — nextYear (independent)
// ═════════════════════════════════════════════════════════════════════════════
describe('/NY — nextYear option (independent)', () => {
  it('returns the four-digit year of next year', () => {
    expect(getDate({ ...s, nextYear: true }).nextYear).toBe('2025');
  });

  it('is independent — ignores other component options', () => {
    const r = getDate({ ...s, nextYear: true, month: true });
    expect(r.nextYear).toBe('2025');
    expect(r.month).toBeUndefined();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /Q — quarter
// ═════════════════════════════════════════════════════════════════════════════
describe('/Q — quarter option', () => {
  it('returns the current quarter as a number', () => {
    expect(getDate({ ...s, quarter: true }).quarter).toBe(1);
  });

  it('returns the season name when season is true', () => {
    expect(getDate({ ...s, quarter: true, season: true }).quarter).toBe('Winter');
  });

  it('returns Q2 for a May date', () => {
    jest.setSystemTime(new Date(2024, 4, 1)); // May → Q2
    expect(getDate({ ...s, quarter: true }).quarter).toBe(2);
  });

  it('returns Q3 for an August date', () => {
    jest.setSystemTime(new Date(2024, 7, 1)); // August → Q3
    expect(getDate({ ...s, quarter: true }).quarter).toBe(3);
  });

  it('returns Q4 for a November date', () => {
    jest.setSystemTime(new Date(2024, 10, 1)); // November → Q4
    expect(getDate({ ...s, quarter: true }).quarter).toBe(4);
  });

  it('season: Q2 maps to Spring', () => {
    jest.setSystemTime(new Date(2024, 4, 1));
    expect(getDate({ ...s, quarter: true, season: true }).quarter).toBe('Spring');
  });

  it('season: Q3 maps to Summer', () => {
    jest.setSystemTime(new Date(2024, 7, 1));
    expect(getDate({ ...s, quarter: true, season: true }).quarter).toBe('Summer');
  });

  it('season: Q4 maps to Fall', () => {
    jest.setSystemTime(new Date(2024, 10, 1));
    expect(getDate({ ...s, quarter: true, season: true }).quarter).toBe('Fall');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /T — terminalDate (independent)
// ═════════════════════════════════════════════════════════════════════════════
describe('/T — terminalDate option (independent)', () => {
  it('returns the date in MM/DD/YYYY format', () => {
    expect(getDate({ ...s, terminalDate: true }).terminalDate).toBe('03/15/2024');
  });

  it('is independent — ignores other component options', () => {
    const r = getDate({ ...s, terminalDate: true, month: true, year: true });
    expect(r.terminalDate).toBe('03/15/2024');
    expect(r.month).toBeUndefined();
  });

  it('respects the order modifier (-d-m-y)', () => {
    expect(getDate({ ...s, terminalDate: true, order: 'd-m-y' }).terminalDate).toBe('15/03/2024');
  });

  it('respects the order modifier (-y-m-d)', () => {
    expect(getDate({ ...s, terminalDate: true, order: 'y-m-d' }).terminalDate).toBe('2024/03/15');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// /Y — year
// ═════════════════════════════════════════════════════════════════════════════
describe('/Y — year option', () => {
  it('returns the four-digit current year', () => {
    expect(getDate({ ...s, year: true }).year).toBe('2024');
  });

  it('returns the two-digit year when twoDigit is true', () => {
    expect(getDate({ ...s, year: true, twoDigit: true }).year).toBe('24');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// --leap (independent)
// ═════════════════════════════════════════════════════════════════════════════
describe('--leap option (independent)', () => {
  it('returns 1 for a leap year', () => {
    // 2024 is a leap year
    expect(getDate({ ...s, leap: true }).checkLeapYear).toBe(1);
  });

  it('returns 0 for a non-leap year', () => {
    jest.setSystemTime(new Date(2023, 2, 15));
    expect(getDate({ ...s, leap: true }).checkLeapYear).toBe(0);
  });

  it('is independent — ignores all other options', () => {
    const r = getDate({ ...s, leap: true, month: true, year: true, quarter: true });
    expect(r.checkLeapYear).toBe(1);
    expect(r.month).toBeUndefined();
    expect(r.year).toBeUndefined();
    expect(r.quarter).toBeUndefined();
  });

  it('correctly identifies century leap year 2000', () => {
    jest.setSystemTime(new Date(2000, 0, 1));
    expect(getDate({ ...s, leap: true }).checkLeapYear).toBe(1);
  });

  it('correctly rejects century non-leap year 1900', () => {
    jest.setSystemTime(new Date(1900, 0, 1));
    expect(getDate({ ...s, leap: true }).checkLeapYear).toBe(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// --clear-var (independent)
// ═════════════════════════════════════════════════════════════════════════════
describe('--clear-var option', () => {
  it('returns an empty object', () => {
    expect(getDate({ ...s, clearVars: true })).toEqual({});
  });

  it('ignores all other options and returns empty', () => {
    const r = getDate({ ...s, clearVars: true, month: true, year: true });
    expect(r).toEqual({});
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// silent option
// ═════════════════════════════════════════════════════════════════════════════
describe('silent option', () => {
  it('does not write to stdout when silent is true', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    getDate({ silent: true });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('writes to stdout when silent is false', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    getDate({ silent: false });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
