import { GetDateOptions, GetDateResult } from './types';
import {
  padTwoDigits,
  formatDate,
  getMonthName,
  getLastMonthName,
  getTwoDigitYear,
  getFourDigitYear,
  isLeapYear,
  getTerminalDate,
} from './utils/dateUtils';
import {
  getQuarterFromMonth,
  getLastQuarter,
  getSeasonFromQuarter,
} from './utils/quarterUtils';

/**
 * Get the current date in a variety of formats.
 *
 * Calling with no options returns the full default result:
 * `date` (MM-DD-YY), `twoDigitDate` (YY), `lastMonth`, `month`, `quarter`, and `year`.
 *
 * Passing any component option (`day`, `month`, `quarter`, `year`, etc.) switches the
 * function to "component mode" — only the requested fields are populated and `date` is
 * NOT automatically included (unless `day` is also set).
 *
 * Certain options are **independent** and short-circuit all others when set:
 * `leap`, `terminalDate`, `lastQuarter`, `nextYear`, `clearVars`.
 *
 * @param options  Configuration object. All fields are optional.
 * @returns        A plain object containing the requested date values.
 */
export function getDate(options: GetDateOptions = {}): GetDateResult {
  const now  = new Date();
  const result: GetDateResult = {};

  // ── Independent: clearVars ──────────────────────────────────────────────────
  // Signals that the caller's previously stored date state should be reset.
  // Returns an empty object so the caller can assign it to their variable store.
  if (options.clearVars) {
    return {};
  }

  // ── Independent: leap ──────────────────────────────────────────────────────
  if (options.leap) {
    result.checkLeapYear = isLeapYear(now.getFullYear()) ? 1 : 0;
    return result;
  }

  // ── Independent: terminalDate ──────────────────────────────────────────────
  // Returns the date in MM/DD/YYYY format (or a reordered variant).
  if (options.terminalDate) {
    result.terminalDate = getTerminalDate(now, options.order);
    if (options.silent === false) {
      process.stdout.write(result.terminalDate + '\n');
    }
    return result;
  }

  // ── Independent: lastQuarter ───────────────────────────────────────────────
  if (options.lastQuarter) {
    result.lastQuarter = getLastQuarter(now);
    if (options.silent === false) {
      process.stdout.write(`Q${result.lastQuarter}\n`);
    }
    return result;
  }

  // ── Independent: nextYear ──────────────────────────────────────────────────
  if (options.nextYear) {
    result.nextYear = String(now.getFullYear() + 1);
    if (options.silent === false) {
      process.stdout.write(result.nextYear + '\n');
    }
    return result;
  }

  // ── Determine mode ─────────────────────────────────────────────────────────
  const hasComponentOptions = !!(
    options.day      ||
    options.lastMonth ||
    options.lastYear  ||
    options.month     ||
    options.quarter   ||
    options.year
  );

  // ── Default mode (no component options) ────────────────────────────────────
  // Populates: date (or fullDate / slashDate), twoDigitDate, lastMonth,
  //            month, quarter, year.
  if (!hasComponentOptions) {
    const separator  = options.slash ? '/' : '-';
    const isFourDigit = options.full ?? false;
    const dateStr    = formatDate(now, separator, isFourDigit);

    if (options.full) {
      result.fullDate = dateStr;
    } else if (options.slash && options.alternateVar) {
      result.slashDate = dateStr;
    } else if (options.slash && options.customVar) {
      result[options.customVar] = dateStr;
    } else {
      result.date = dateStr;
    }

    // Secondary default variables — always populated in default mode.
    result.twoDigitDate = getTwoDigitYear(now);
    result.lastMonth    = getLastMonthName(now);
    result.month        = getMonthName(now);
    result.quarter      = getQuarterFromMonth(now.getMonth());
    result.year         = getFourDigitYear(now);

    if (options.silent === false) {
      const output = result.fullDate ?? result.slashDate ?? result[options.customVar ?? ''] ?? result.date;
      process.stdout.write((output as string) + '\n');
    }

    return result;
  }

  // ── Component mode ─────────────────────────────────────────────────────────
  // Only the requested fields are populated. The console output lists
  // all selected values joined by ", " (unless silent is true).
  const outputParts: string[] = [];

  // day — day of month; also includes the base MM-DD-YY date string.
  if (options.day) {
    result.day  = padTwoDigits(now.getDate());
    result.date = formatDate(now, '-', false);
    outputParts.push(result.day, result.date);

    // dayMonth — two-digit month number. Effective only when used with day.
    if (options.dayMonth) {
      result.monthNumber = padTwoDigits(now.getMonth() + 1);
      outputParts.push(result.monthNumber);
    }
  }

  // lastMonth — last month name.
  if (options.lastMonth) {
    result.lastMonth = getLastMonthName(now, options.abbreviated);
    outputParts.push(result.lastMonth);
  }

  // lastYear — last year (four digits).
  if (options.lastYear) {
    result.lastYear = String(now.getFullYear() - 1);
    outputParts.push(result.lastYear);
  }

  // month — current month name (full or abbreviated).
  if (options.month) {
    result.month = getMonthName(now, options.abbreviated);
    outputParts.push(result.month);
  }

  // quarter — current quarter (number or season name).
  if (options.quarter) {
    const q = getQuarterFromMonth(now.getMonth());
    result.quarter = options.season ? getSeasonFromQuarter(q) : q;
    outputParts.push(String(result.quarter));
  }

  // year — current year (four digits, or two digits with twoDigit modifier).
  if (options.year) {
    result.year = options.twoDigit ? getTwoDigitYear(now) : getFourDigitYear(now);
    outputParts.push(result.year);
  }

  if (options.silent === false && outputParts.length > 0) {
    process.stdout.write(outputParts.join(', ') + '\n');
  }

  return result;
}

// Allow direct execution for testing: `node dist/getDate.js`
// Not promoted as a command-line tool.
if (require.main === module) {
  getDate({ silent: false });
}
