/**
 * Options for the getDate function.
 */
export interface GetDateOptions {
  // ── Component selection ────────────────────────────────────────────────────
  /** Include the day of the month as two digits (DD). */
  day?: boolean;

  /** Include the two-digit month number (MM). Only effective when `day` is also true. */
  dayMonth?: boolean;

  /** Include the full name of last month (e.g. "January"). */
  lastMonth?: boolean;

  /**
   * Get the last fiscal quarter relative to the current date.
   * Independent option: other component options are ignored when this is set.
   */
  lastQuarter?: boolean;

  /** Include the four-digit year of last year (e.g. "2024"). */
  lastYear?: boolean;

  /** Include the full (or abbreviated) name of the current month. */
  month?: boolean;

  /**
   * Get the four-digit year of next year (e.g. "2026").
   * Independent option: other component options are ignored when this is set.
   */
  nextYear?: boolean;

  /** Include the current fiscal quarter (1–4), or a season name when `season` is true. */
  quarter?: boolean;

  /**
   * Return the date in terminal format: MM/DD/YYYY (or reordered via `order`).
   * Independent option: other component options are ignored when this is set.
   */
  terminalDate?: boolean;

  /** Include the four-digit current year (or two-digit when `twoDigit` is true). */
  year?: boolean;

  // ── Format modifiers ───────────────────────────────────────────────────────
  /**
   * Return MM-DD-YYYY instead of the default MM-DD-YY.
   * Stored in `result.fullDate` rather than `result.date`.
   */
  full?: boolean;

  /** Use a forward-slash separator (MM/DD/YY) instead of a dash (MM-DD-YY). */
  slash?: boolean;

  /**
   * When combined with `slash`, store the result in `result.slashDate`
   * rather than the default `result.date`.
   */
  alternateVar?: boolean;

  /**
   * When combined with `slash`, store the result under this custom key
   * on the returned object (e.g. `result[customVar]`).
   */
  customVar?: string;

  // ── Utility options ────────────────────────────────────────────────────────
  /**
   * Check whether the current year is a leap year.
   * Returns `{ checkLeapYear: 1 }` (leap) or `{ checkLeapYear: 0 }` (not leap).
   * Independent option: all other options are ignored when this is set.
   */
  leap?: boolean;

  /**
   * Signal that all previously stored date variables should be
   * considered cleared. Returns an empty result object.
   */
  clearVars?: boolean;

  // ── Output behaviour ───────────────────────────────────────────────────────
  /**
   * Silent mode. When unset or `true`, nothing is written to stdout (the
   * default library behaviour). Pass `false` to write output to stdout.
   */
  silent?: boolean;

  // ── Modifier flags ─────────────────────────────────────────────────────────
  /** Abbreviate the month name (e.g. "Jan" instead of "January"). Only effective with `month` or `lastMonth`. */
  abbreviated?: boolean;

  /**
   * Set the order of day, month, and year tokens in terminal date format.
   * Only effective with `terminalDate`.
   * Examples: `"d-m-y"`, `"y-m-d"`, `"m-y-d"`, etc.
   */
  order?: string;

  /**
   * Return only the last two digits of the current year.
   * Only effective with `year`.
   */
  twoDigit?: boolean;

  /**
   * Replace the numeric quarter with its corresponding season name.
   * Only effective with `quarter`.
   * Output is stored in `result.quarter` as a string.
   */
  season?: boolean;
}

/**
 * The result object returned by `getDate()`.
 *
 * Properties are set depending on which options were passed.
 * A default call (no options) populates: `date`, `twoDigitDate`,
 * `lastMonth`, `month`, `quarter`, and `year`.
 */
export interface GetDateResult {
  /** MM-DD-YY — the default formatted date (or MM/DD/YY when `slash` is used). */
  date?: string;

  /** MM-DD-YYYY — four-digit-year date, set when `full` is used. */
  fullDate?: string;

  /** MM/DD/YY — slash-separator date stored in the alternate variable slot (`slash` + `alternateVar`). */
  slashDate?: string;

  /** YY — the last two digits of the current year (always populated in default mode). */
  twoDigitDate?: string;

  /** Full (or abbreviated) name of last month (e.g. "December" or "Dec"). */
  lastMonth?: string;

  /** Full (or abbreviated) name of the current month (e.g. "January" or "Jan"). */
  month?: string;

  /**
   * Current fiscal quarter as a number (1–4) or season name ("Winter", "Spring",
   * "Summer", "Fall") when `season` is true.
   */
  quarter?: number | string;

  /** Last fiscal quarter (1–4). */
  lastQuarter?: number;

  /** Four-digit current year (e.g. "2025"), or two-digit (e.g. "25") when `twoDigit` is used with `year`. */
  year?: string;

  /** Four-digit last year (e.g. "2024"). */
  lastYear?: string;

  /** Four-digit next year (e.g. "2026"). */
  nextYear?: string;

  /** Day of the month as two digits (e.g. "05"). Set when `day` is used. */
  day?: string;

  /** Two-digit month number (e.g. "01"). Set when `dayMonth` is used together with `day`. */
  monthNumber?: string;

  /** Date in terminal format (MM/DD/YYYY or reordered). Set when `terminalDate` is used. */
  terminalDate?: string;

  /** `1` if the current year is a leap year, `0` otherwise. Set when `leap` is used. */
  checkLeapYear?: 0 | 1;

  /** Allows custom variable keys set via `customVar`. */
  [key: string]: string | number | undefined;
}
