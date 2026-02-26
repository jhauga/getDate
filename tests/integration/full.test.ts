/**
 * Integration / full-coverage tests.
 *
 * These tests exercise the public API of getDate() end-to-end, verifying that
 * combinations of options produce the correct composite results. All unit
 * option tests are re-executed here via full-suite calls as well as targeted
 * combination scenarios.
 *
 * Fixed reference date: June 20, 2023
 *   ├─ month (0-indexed): 5  → June   → Q2   → Spring
 *   ├─ lastMonth:             → May
 *   ├─ day:                   → 20
 *   ├─ year:                  → 2023  (two-digit: "23")
 *   ├─ lastYear:              → 2022
 *   ├─ nextYear:              → 2024
 *   └─ leap:                  → 0  (2023 is NOT a leap year)
 */

import { getDate } from '../../src/getDate';
import type { GetDateResult } from '../../src/types';

const FIXED = new Date(2023, 5, 20); // June 20, 2023

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(FIXED);
});

afterEach(() => {
  jest.useRealTimers();
});

const s = { silent: true };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function expectFormatMMDDYY(value: string | undefined): void {
  expect(value).toMatch(/^\d{2}-\d{2}-\d{2}$/);
}

function expectFormatMMDDYYYY(value: string | undefined): void {
  expect(value).toMatch(/^\d{2}-\d{2}-\d{4}$/);
}

function expectFormatSlash(value: string | undefined): void {
  expect(value).toMatch(/^\d{2}\/\d{2}\/\d{2}$/);
}

// ═════════════════════════════════════════════════════════════════════════════
// All unit options re-verified against the June 2023 reference date
// ═════════════════════════════════════════════════════════════════════════════
describe('all options — June 20, 2023 reference', () => {
  describe('default call', () => {
    let r: GetDateResult;
    beforeEach(() => { r = getDate(s); });

    it('date is MM-DD-YY', ()             => expect(r.date).toBe('06-20-23'));
    it('twoDigitDate is YY',  ()          => expect(r.twoDigitDate).toBe('23'));
    it('lastMonth is May',    ()          => expect(r.lastMonth).toBe('May'));
    it('month is June',       ()          => expect(r.month).toBe('June'));
    it('quarter is 2',        ()          => expect(r.quarter).toBe(2));
    it('year is 2023',        ()          => expect(r.year).toBe('2023'));
  });

  it('--full  → fullDate MM-DD-YYYY',     () => expect(getDate({ ...s, full: true }).fullDate).toBe('06-20-2023'));
  it('--slash → date MM/DD/YY',           () => expect(getDate({ ...s, slash: true }).date).toBe('06/20/23'));
  it('--slash -v → slashDate',            () => expect(getDate({ ...s, slash: true, alternateVar: true }).slashDate).toBe('06/20/23'));
  it('--slash customVar → custom key',    () => expect(getDate({ ...s, slash: true, customVar: '_custom' })['_custom']).toBe('06/20/23'));

  it('/D  → day 20, date 06-20-23',       () => {
    const r = getDate({ ...s, day: true });
    expect(r.day).toBe('20');
    expect(r.date).toBe('06-20-23');
  });

  it('/D /DM → monthNumber 06',           () => expect(getDate({ ...s, day: true, dayMonth: true }).monthNumber).toBe('06'));
  it('/LM → lastMonth May',               () => expect(getDate({ ...s, lastMonth: true }).lastMonth).toBe('May'));
  it('/LM -abbrv → May',                  () => expect(getDate({ ...s, lastMonth: true, abbreviated: true }).lastMonth).toBe('May'));
  it('/LQ → lastQuarter 1 (Q2−1)',        () => expect(getDate({ ...s, lastQuarter: true }).lastQuarter).toBe(1));
  it('/LY → lastYear 2022',               () => expect(getDate({ ...s, lastYear: true }).lastYear).toBe('2022'));
  it('/M  → month June',                  () => expect(getDate({ ...s, month: true }).month).toBe('June'));
  it('/M -abbrv → Jun',                   () => expect(getDate({ ...s, month: true, abbreviated: true }).month).toBe('Jun'));
  it('/NY → nextYear 2024',               () => expect(getDate({ ...s, nextYear: true }).nextYear).toBe('2024'));
  it('/Q  → quarter 2',                   () => expect(getDate({ ...s, quarter: true }).quarter).toBe(2));
  it('/Q --season → Spring',              () => expect(getDate({ ...s, quarter: true, season: true }).quarter).toBe('Spring'));
  it('/T  → terminalDate 06/20/2023',     () => expect(getDate({ ...s, terminalDate: true }).terminalDate).toBe('06/20/2023'));
  it('/T -d-m-y → 20/06/2023',           () => expect(getDate({ ...s, terminalDate: true, order: 'd-m-y' }).terminalDate).toBe('20/06/2023'));
  it('/Y  → year 2023',                   () => expect(getDate({ ...s, year: true }).year).toBe('2023'));
  it('/Y -t → year 23',                   () => expect(getDate({ ...s, year: true, twoDigit: true }).year).toBe('23'));
  it('--leap → checkLeapYear 0',          () => expect(getDate({ ...s, leap: true }).checkLeapYear).toBe(0));
  it('--clear-var → empty object',        () => expect(getDate({ ...s, clearVars: true })).toEqual({}));
});

// ═════════════════════════════════════════════════════════════════════════════
// Composite / combination scenarios
// ═════════════════════════════════════════════════════════════════════════════
describe('combination scenarios', () => {
  it('/M /D → month + day + date', () => {
    const r = getDate({ ...s, month: true, day: true });
    expect(r.month).toBe('June');
    expect(r.day).toBe('20');
    expect(r.date).toBe('06-20-23');
  });

  it('/M /Q /Y → month + quarter + year', () => {
    const r = getDate({ ...s, month: true, quarter: true, year: true });
    expect(r.month).toBe('June');
    expect(r.quarter).toBe(2);
    expect(r.year).toBe('2023');
  });

  it('/M /Q /Y --season → month + season + year', () => {
    const r = getDate({ ...s, month: true, quarter: true, year: true, season: true });
    expect(r.month).toBe('June');
    expect(r.quarter).toBe('Spring');
    expect(r.year).toBe('2023');
  });

  it('/M /D /Q /Y /LM /LY → all component options together', () => {
    const r = getDate({ ...s, month: true, day: true, quarter: true, year: true, lastMonth: true, lastYear: true });
    expect(r.month).toBe('June');
    expect(r.day).toBe('20');
    expect(r.date).toBe('06-20-23');
    expect(r.quarter).toBe(2);
    expect(r.year).toBe('2023');
    expect(r.lastMonth).toBe('May');
    expect(r.lastYear).toBe('2022');
  });

  it('/D /DM → day + monthNumber', () => {
    const r = getDate({ ...s, day: true, dayMonth: true });
    expect(r.day).toBe('20');
    expect(r.monthNumber).toBe('06');
    expect(r.date).toBe('06-20-23');
  });

  it('/LM 0 → lastMonth only, silent', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const r = getDate({ lastMonth: true, silent: true });
    expect(r.lastMonth).toBe('May');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('/M /Q /Y 1 → outputs to stdout when silent is false', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    getDate({ month: true, quarter: true, year: true, silent: false });
    expect(spy).toHaveBeenCalledTimes(1);
    const written = (spy.mock.calls[0][0] as string);
    expect(written).toContain('June');
    expect(written).toContain('2');
    expect(written).toContain('2023');
    spy.mockRestore();
  });

  it('--full --slash → four-digit year with slash separator', () => {
    const r = getDate({ ...s, full: true, slash: true });
    expect(r.fullDate).toBe('06/20/2023');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Format shape assertions
// ═════════════════════════════════════════════════════════════════════════════
describe('output format shapes', () => {
  it('default date matches MM-DD-YY pattern', () => {
    expectFormatMMDDYY(getDate(s).date);
  });

  it('--full date matches MM-DD-YYYY pattern', () => {
    expectFormatMMDDYYYY(getDate({ ...s, full: true }).fullDate);
  });

  it('--slash date matches MM/DD/YY pattern', () => {
    expectFormatSlash(getDate({ ...s, slash: true }).date);
  });

  it('/T matches MM/DD/YYYY pattern', () => {
    expect(getDate({ ...s, terminalDate: true }).terminalDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('/Y returns a 4-character string', () => {
    expect(getDate({ ...s, year: true }).year).toHaveLength(4);
  });

  it('/Y -t returns a 2-character string', () => {
    expect(getDate({ ...s, year: true, twoDigit: true }).year).toHaveLength(2);
  });

  it('quarter is between 1 and 4', () => {
    const q = getDate({ ...s, quarter: true }).quarter;
    expect(typeof q).toBe('number');
    expect(q as number).toBeGreaterThanOrEqual(1);
    expect(q as number).toBeLessThanOrEqual(4);
  });

  it('lastQuarter is between 1 and 4', () => {
    const lq = getDate({ ...s, lastQuarter: true }).lastQuarter as number;
    expect(lq).toBeGreaterThanOrEqual(1);
    expect(lq).toBeLessThanOrEqual(4);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Year-boundary edge cases
// ═════════════════════════════════════════════════════════════════════════════
describe('year boundary edge cases', () => {
  it('January 1st: lastMonth is December', () => {
    jest.setSystemTime(new Date(2024, 0, 1));
    expect(getDate({ ...s, lastMonth: true }).lastMonth).toBe('December');
  });

  it('January 1st: lastQuarter is 4', () => {
    jest.setSystemTime(new Date(2024, 0, 1)); // Q1 → last = Q4
    expect(getDate({ ...s, lastQuarter: true }).lastQuarter).toBe(4);
  });

  it('December 31st: quarter is 4', () => {
    jest.setSystemTime(new Date(2023, 11, 31));
    expect(getDate({ ...s, quarter: true }).quarter).toBe(4);
  });

  it('--full on leap day returns correct date', () => {
    jest.setSystemTime(new Date(2024, 1, 29)); // Feb 29, 2024
    expect(getDate({ ...s, full: true }).fullDate).toBe('02-29-2024');
  });

  it('--leap on Feb 29 2024 returns 1', () => {
    jest.setSystemTime(new Date(2024, 1, 29));
    expect(getDate({ ...s, leap: true }).checkLeapYear).toBe(1);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Independent option isolation
// ═════════════════════════════════════════════════════════════════════════════
describe('independent option isolation', () => {
  const componentOpts = { month: true, day: true, year: true, quarter: true };

  it('--leap ignores all component options', () => {
    const r = getDate({ ...s, leap: true, ...componentOpts });
    expect(r.checkLeapYear).toBeDefined();
    expect(r.month).toBeUndefined();
    expect(r.day).toBeUndefined();
  });

  it('/T ignores all component options', () => {
    const r = getDate({ ...s, terminalDate: true, ...componentOpts });
    expect(r.terminalDate).toBeDefined();
    expect(r.month).toBeUndefined();
  });

  it('/LQ ignores all component options', () => {
    const r = getDate({ ...s, lastQuarter: true, ...componentOpts });
    expect(r.lastQuarter).toBeDefined();
    expect(r.month).toBeUndefined();
  });

  it('/NY ignores all component options', () => {
    const r = getDate({ ...s, nextYear: true, ...componentOpts });
    expect(r.nextYear).toBeDefined();
    expect(r.month).toBeUndefined();
  });

  it('--clear-var ignores everything and returns {}', () => {
    const r = getDate({ ...s, clearVars: true, ...componentOpts, leap: true });
    expect(r).toEqual({});
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Cross-platform consistency
// ═════════════════════════════════════════════════════════════════════════════
describe('cross-platform output consistency', () => {
  it('produces identical results across consecutive calls with same clock', () => {
    const r1 = getDate(s);
    const r2 = getDate(s);
    expect(r1).toEqual(r2);
  });

  it('does not use OS-specific date formatting (no locale strings)', () => {
    // Ensure we are using padded numeric parts, not locale-dependent strings
    const r = getDate(s);
    expect(r.date).toMatch(/^\d{2}-\d{2}-\d{2}$/);
    expect(r.year).toMatch(/^\d{4}$/);
    expect(typeof r.month).toBe('string');
  });
});
