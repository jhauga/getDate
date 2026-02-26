import {
  padTwoDigits,
  formatDate,
  getMonthName,
  getLastMonthName,
  getTwoDigitYear,
  getFourDigitYear,
  isLeapYear,
  getTerminalDate,
} from '../../src/utils/dateUtils';

// Fixed reference date: March 15, 2024 (2024 is a leap year; Q1; last month = February)
const REF_DATE = new Date(2024, 2, 15); // month is 0-indexed

describe('padTwoDigits', () => {
  it('pads single-digit numbers with a leading zero', () => {
    expect(padTwoDigits(1)).toBe('01');
    expect(padTwoDigits(9)).toBe('09');
  });

  it('leaves two-digit numbers unchanged', () => {
    expect(padTwoDigits(10)).toBe('10');
    expect(padTwoDigits(31)).toBe('31');
  });

  it('handles zero', () => {
    expect(padTwoDigits(0)).toBe('00');
  });
});

describe('formatDate', () => {
  it('returns MM-DD-YY by default', () => {
    expect(formatDate(REF_DATE)).toBe('03-15-24');
  });

  it('uses the provided separator', () => {
    expect(formatDate(REF_DATE, '/')).toBe('03/15/24');
  });

  it('returns MM-DD-YYYY when fourDigit is true', () => {
    expect(formatDate(REF_DATE, '-', true)).toBe('03-15-2024');
  });

  it('returns MM/DD/YYYY with slash separator and four-digit year', () => {
    expect(formatDate(REF_DATE, '/', true)).toBe('03/15/2024');
  });

  it('correctly formats January 1st', () => {
    const jan1 = new Date(2025, 0, 1);
    expect(formatDate(jan1)).toBe('01-01-25');
  });
});

describe('getMonthName', () => {
  it('returns the full month name', () => {
    expect(getMonthName(REF_DATE)).toBe('March');
  });

  it('returns the abbreviated month name when requested', () => {
    expect(getMonthName(REF_DATE, true)).toBe('Mar');
  });

  it('returns correct names for all twelve months', () => {
    const names = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    names.forEach((name, i) => {
      expect(getMonthName(new Date(2024, i, 1))).toBe(name);
    });
  });

  it('returns correct abbreviations for all twelve months', () => {
    const abbr = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    abbr.forEach((a, i) => {
      expect(getMonthName(new Date(2024, i, 1), true)).toBe(a);
    });
  });
});

describe('getLastMonthName', () => {
  it('returns the full name of the previous month', () => {
    expect(getLastMonthName(REF_DATE)).toBe('February');
  });

  it('wraps correctly from January to December', () => {
    const jan = new Date(2024, 0, 10); // January
    expect(getLastMonthName(jan)).toBe('December');
  });

  it('returns abbreviated name when requested', () => {
    expect(getLastMonthName(REF_DATE, true)).toBe('Feb');
  });
});

describe('getTwoDigitYear', () => {
  it('returns the last two digits of the year as a zero-padded string', () => {
    expect(getTwoDigitYear(REF_DATE)).toBe('24');
  });

  it('zero-pads years whose last two digits are less than 10', () => {
    expect(getTwoDigitYear(new Date(2005, 0, 1))).toBe('05');
  });
});

describe('getFourDigitYear', () => {
  it('returns the full four-digit year', () => {
    expect(getFourDigitYear(REF_DATE)).toBe('2024');
  });
});

describe('isLeapYear', () => {
  it('identifies leap years divisible by 4', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2020)).toBe(true);
  });

  it('rejects century years that are not divisible by 400', () => {
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
  });

  it('accepts century years divisible by 400', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2400)).toBe(true);
  });

  it('rejects regular non-leap years', () => {
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2025)).toBe(false);
  });
});

describe('getTerminalDate', () => {
  it('returns MM/DD/YYYY by default (m-d-y order)', () => {
    expect(getTerminalDate(REF_DATE)).toBe('03/15/2024');
  });

  it('respects d-m-y order', () => {
    expect(getTerminalDate(REF_DATE, 'd-m-y')).toBe('15/03/2024');
  });

  it('respects y-m-d order', () => {
    expect(getTerminalDate(REF_DATE, 'y-m-d')).toBe('2024/03/15');
  });

  it('respects m-y-d order', () => {
    expect(getTerminalDate(REF_DATE, 'm-y-d')).toBe('03/2024/15');
  });

  it('falls back to m-d-y for an invalid order string', () => {
    expect(getTerminalDate(REF_DATE, 'invalid')).toBe('03/15/2024');
  });

  it('ignores a leading dash in the order string', () => {
    expect(getTerminalDate(REF_DATE, '-d-m-y')).toBe('15/03/2024');
  });
});
