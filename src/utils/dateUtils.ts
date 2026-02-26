const MONTHS: readonly string[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTHS_ABBR: readonly string[] = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Zero-pad a number to two digits. */
export function padTwoDigits(num: number): string {
  return String(num).padStart(2, '0');
}

/**
 * Format a Date as MM{sep}DD{sep}YY or MM{sep}DD{sep}YYYY.
 * @param date       The date to format.
 * @param separator  Character placed between parts (default '-').
 * @param fourDigit  When true, the year component is four digits.
 */
export function formatDate(
  date: Date,
  separator: string = '-',
  fourDigit: boolean = false,
): string {
  const month = padTwoDigits(date.getMonth() + 1);
  const day   = padTwoDigits(date.getDate());
  const year  = fourDigit
    ? String(date.getFullYear())
    : String(date.getFullYear()).slice(-2);
  return `${month}${separator}${day}${separator}${year}`;
}

/** Return the full or abbreviated name of the month for a given Date. */
export function getMonthName(date: Date, abbreviated: boolean = false): string {
  const idx = date.getMonth();
  return abbreviated ? MONTHS_ABBR[idx] : MONTHS[idx];
}

/** Return the full or abbreviated name of the month prior to the given Date. */
export function getLastMonthName(date: Date, abbreviated: boolean = false): string {
  const lastMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return getMonthName(lastMonthDate, abbreviated);
}

/** Return the last two digits of the year as a zero-padded string (e.g. "05"). */
export function getTwoDigitYear(date: Date): string {
  return String(date.getFullYear()).slice(-2);
}

/** Return the full four-digit year as a string (e.g. "2025"). */
export function getFourDigitYear(date: Date): string {
  return String(date.getFullYear());
}

/** Return true if the given year is a leap year. */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Return the date in terminal format using a configurable token order.
 *
 * @param date   The date to format.
 * @param order  Token order string such as "m-d-y", "d-m-y", "y-m-d", etc.
 *               Tokens are 'm' (month), 'd' (day), 'y' (four-digit year).
 *               Defaults to "m-d-y" which produces MM/DD/YYYY.
 *
 * Parts are separated by '/' to match the terminal output convention.
 */
export function getTerminalDate(date: Date, order: string = 'm-d-y'): string {
  const parts: Record<string, string> = {
    m: padTwoDigits(date.getMonth() + 1),
    d: padTwoDigits(date.getDate()),
    y: String(date.getFullYear()),
  };

  const normalised = order.toLowerCase().replace(/^-/, '');
  const tokens = normalised.split('-').filter((t) => t === 'm' || t === 'd' || t === 'y');

  if (tokens.length !== 3) {
    return `${parts['m']}/${parts['d']}/${parts['y']}`;
  }

  return tokens.map((t) => parts[t]).join('/');
}
