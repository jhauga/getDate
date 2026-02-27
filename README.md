# ![logo](logo.png)

> Get the current date in any format your project needs.

A cross-platform Node.js utility written in TypeScript that retrieves, formats, and transforms the current date.

Works identically on **macOS**, **Linux**, and **Windows**.

## Table of Contents (TOC)

<details>

<summary>Toggle TOC</summary>

---

- [Features](#features)
- [Install](#install)
  - [From npm](#from-npm)
  - [From GitHub (install into a codebase)](#from-github-install-into-a-codebase)
  - [Local install (copy into codebase)](#local-install-copy-into-codebase)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [getDate(options?)](#getdateoptions)
  - [Options](#options)
  - [Return Values](#return-values)
- [Option Reference](#option-reference)
- [Examples](#examples)
- [Testing](#testing)
- [Build](#build)
- [License](#license)

---
</details>

## Features

- Default call returns all common date components in one object
- Flexible options for every date component: day, month, quarter, year, and more
- Cross-platform — uses the Node.js `Date` API exclusively, no OS-specific calls
- TypeScript-first with full type declarations
- Tree-shakeable — import only what you need
- Zero runtime dependencies
- Fully tested: unit tests per option + integration suite

---

## Install

### From npm

```bash
npm install @jhauga/getdate
```

```bash
yarn add @jhauga/getdate
```

```bash
pnpm add @jhauga/getdate
```

### From GitHub (install into a codebase)

If the package has not been published to the npm registry, install directly from the GitHub repository:

```bash
npm install github:YOUR_USERNAME/getDate
```

Replace `YOUR_USERNAME` with the GitHub user or organization that owns the repository. After running this, the package appears under `node_modules/@jhauga/getdate` and can be imported as normal.

To pin to a specific tag or commit:

```bash
npm install github:YOUR_USERNAME/getDate#v1.0.0
```

### Local install (copy into codebase)

Clone or download the repository, then install it as a local package:

```bash
# 1. Clone the repo next to your project
git clone https://github.com/YOUR_USERNAME/getDate.git

# 2. Build it
cd getDate
npm install
npm run build

# 3. Install it into your project
cd ../your-project
npm install ../getDate
```

Or reference it with a relative path directly in your `package.json`:

```json
{
  "dependencies": {
    "@jhauga/getdate": "file:../getDate"
  }
}
```

Then run `npm install`.

### Adding to your project's package.json

Rather than running an install command, you can add the dependency directly to your project's `package.json` and then run `npm install`.

**When published to the npm registry:**

```json
{
  "dependencies": {
    "@jhauga/getdate": "^1.0.0"
  }
}
```

**When not yet published (GitHub source):**

```json
{
  "dependencies": {
    "@jhauga/getdate": "github:YOUR_USERNAME/getDate"
  }
}
```

To pin to a specific release tag or commit:

```json
{
  "dependencies": {
    "@jhauga/getdate": "github:YOUR_USERNAME/getDate#v1.0.0"
  }
}
```

After editing `package.json`, run:

```bash
npm install
```

---

## Quick Start

```typescript
import { getDate } from '@jhauga/getdate';

// Default call — returns all common date values
const result = getDate();
console.log(result.date);        // "03-15-24"   (MM-DD-YY)
console.log(result.month);       // "March"
console.log(result.quarter);     // 1
console.log(result.year);        // "2024"
console.log(result.lastMonth);   // "February"
console.log(result.twoDigitDate); // "24"
```

All calls are **silent by default** (no stdout output). Pass `silent: false` to enable stdout output.

---

## API Reference

### `getDate(options?)`

```typescript
import { getDate } from '@jhauga/getdate';
import type { GetDateOptions, GetDateResult } from '@jhauga/getdate';

const result: GetDateResult = getDate(options?: GetDateOptions);
```

Returns a plain `GetDateResult` object. The fields that are populated depend on which options you pass.

---

### Options

| Option | Type | Description |
|---|---|---|
| `day` | `boolean` | Day of the month as two digits. Also sets `date` (MM-DD-YY). |
| `dayMonth` | `boolean` | Two-digit month number. Only effective when `day` is also `true`. |
| `lastMonth` | `boolean` | Full (or abbreviated) name of last month. |
| `lastQuarter` | `boolean` | **Independent.** Last fiscal quarter (1–4). |
| `lastYear` | `boolean` | Four-digit year of last year. |
| `month` | `boolean` | Full (or abbreviated) name of the current month. |
| `nextYear` | `boolean` | **Independent.** Four-digit year of next year. |
| `quarter` | `boolean` | Current fiscal quarter (1–4), or season name when `season: true`. |
| `terminalDate` | `boolean` | **Independent.** Date as MM/DD/YYYY (or reordered via `order`). |
| `year` | `boolean` | Four-digit current year, or two-digit when `twoDigit: true`. |
| `full` | `boolean` | Return MM-DD-YYYY (four-digit year) instead of MM-DD-YY. Result is in `fullDate`. |
| `slash` | `boolean` | Use `/` as date separator instead of `-`. |
| `alternateVar` | `boolean` | With `slash`, store the result in `slashDate` instead of `date`. |
| `customVar` | `string` | With `slash`, store the result under this key on the returned object. |
| `leap` | `boolean` | **Independent.** `checkLeapYear: 1` if current year is a leap year, `0` otherwise. |
| `clearVars` | `boolean` | **Independent.** Returns `{}` — signals that stored state should be cleared. |
| `silent` | `boolean` | Unset or `true` suppresses stdout (the default). `false` writes output. |
| `abbreviated` | `boolean` | Abbreviate month names ("Jan" vs "January"). Use with `month` or `lastMonth`. |
| `order` | `string` | Token order for terminal date format. Use with `terminalDate`. E.g. `"d-m-y"`, `"y-m-d"`. |
| `twoDigit` | `boolean` | Return only the last two digits of the year. Use with `year`. |
| `season` | `boolean` | Return the season name instead of the quarter number. Use with `quarter`. |

**Independent options** short-circuit all other options when set: `leap`, `terminalDate`, `lastQuarter`, `nextYear`, `clearVars`.

---

### Return Values

| Field | Type | Description |
|---|---|---|
| `date` | `string` | MM-DD-YY (default) or MM/DD/YY (with `slash`). |
| `fullDate` | `string` | MM-DD-YYYY or MM/DD/YYYY (with `full`). |
| `slashDate` | `string` | MM/DD/YY stored in the alternate slot (`slash` + `alternateVar`). |
| `twoDigitDate` | `string` | YY — two-digit year (always set in default mode). |
| `lastMonth` | `string` | Full or abbreviated name of last month. |
| `month` | `string` | Full or abbreviated name of the current month. |
| `quarter` | `number \| string` | Current fiscal quarter (1–4) or season name. |
| `lastQuarter` | `number` | Last fiscal quarter (1–4). |
| `year` | `string` | Four-digit (or two-digit) current year. |
| `lastYear` | `string` | Four-digit last year. |
| `nextYear` | `string` | Four-digit next year. |
| `day` | `string` | Day of month as two digits. |
| `monthNumber` | `string` | Month as two digits (set by `dayMonth` + `day`). |
| `terminalDate` | `string` | Date in terminal format: MM/DD/YYYY or reordered. |
| `checkLeapYear` | `0 \| 1` | `1` = leap year, `0` = not. |
| `[customVar]` | `string` | Result stored under the key specified by `customVar`. |

---

## Option Reference

### Default call

```typescript
const r = getDate();
// r.date        → "03-15-24"
// r.twoDigitDate → "24"
// r.lastMonth   → "February"
// r.month       → "March"
// r.quarter     → 1
// r.year        → "2024"
```

### `day` — Day of month

```typescript
const r = getDate({ day: true });
// r.day  → "15"
// r.date → "03-15-24"
```

### `day` + `dayMonth` — Day and month number

```typescript
const r = getDate({ day: true, dayMonth: true });
// r.day         → "15"
// r.monthNumber → "03"
// r.date        → "03-15-24"
```

### `lastMonth` — Last month

```typescript
getDate({ lastMonth: true }).lastMonth;         // "February"
getDate({ lastMonth: true, abbreviated: true }).lastMonth; // "Feb"
```

### `lastQuarter` — Last quarter (independent)

```typescript
// March 2024 → Q1 → last quarter = Q4
getDate({ lastQuarter: true }).lastQuarter;     // 4
```

### `lastYear` — Last year

```typescript
getDate({ lastYear: true }).lastYear;           // "2023"
```

### `month` — Month name

```typescript
getDate({ month: true }).month;                 // "March"
getDate({ month: true, abbreviated: true }).month; // "Mar"
```

### `nextYear` — Next year (independent)

```typescript
getDate({ nextYear: true }).nextYear;           // "2025"
```

### `quarter` — Quarter

```typescript
getDate({ quarter: true }).quarter;             // 1
getDate({ quarter: true, season: true }).quarter; // "Winter"
```

### `terminalDate` — Terminal date (independent)

```typescript
getDate({ terminalDate: true }).terminalDate;              // "03/15/2024"
getDate({ terminalDate: true, order: 'd-m-y' }).terminalDate; // "15/03/2024"
getDate({ terminalDate: true, order: 'y-m-d' }).terminalDate; // "2024/03/15"
```

### `year` — Year

```typescript
getDate({ year: true }).year;                   // "2024"
getDate({ year: true, twoDigit: true }).year;   // "24"
```

### `full` — Four-digit year date

```typescript
getDate({ full: true }).fullDate;               // "03-15-2024"
```

### `slash` — Slash separator

```typescript
getDate({ slash: true }).date;                           // "03/15/24"
getDate({ slash: true, alternateVar: true }).slashDate;  // "03/15/24"
getDate({ slash: true, customVar: '_myDate' })['_myDate']; // "03/15/24"
```

### `leap` — Leap year check (independent)

```typescript
getDate({ leap: true }).checkLeapYear;          // 1 (2024 is a leap year)
```

### `clearVars` — Reset (independent)

```typescript
getDate({ clearVars: true });                   // {}
```

### Combinations

```typescript
// month name, day, and full date
const r = getDate({ month: true, day: true });
// r.month → "March",  r.day → "15",  r.date → "03-15-24"

// month, quarter, year with output
const r = getDate({ month: true, quarter: true, year: true, silent: false });
// Writes "March, 1, 2024" to stdout
// r.month → "March",  r.quarter → 1,  r.year → "2024"

// last month, silent
const r = getDate({ lastMonth: true, silent: true });
// r.lastMonth → "February"  (no console output)

// four-digit year with slash separator
const r = getDate({ full: true, slash: true });
// r.fullDate → "03/15/2024"
```

---

## Testing

The test suite covers:
- **Unit tests** — one test per option, verified against a fixed reference date
- **Integration tests** — combination scenarios, edge cases, cross-platform format checks

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage report
npm run test:coverage
```

Tests require the dev dependencies to be installed:

```bash
npm install
npm test
```

### Manual / User Test

A personal test file (`tests/userTest.js`) can be generated and run independently from the main test suite. It is git-ignored and not included when running `npm test`.

```bash
# Launch the interactive walkthrough to build tests/userTest.js
npm run test:make-user-test

# Run the generated test file
npm run test:user
```

`test:make-user-test` opens a terminal prompt where you:
1. Choose **walkthrough** (select options one at a time with arrow keys) or **end process** (generates a template with all options commented out).
2. In walkthrough mode, select each `getDate` option to add from a dropdown. After each selection you are asked "Add another line?" — answer with arrow keys, `y`, `n`, or Enter (Enter defaults to No).

> **Note:** `npm run test:user` requires a build (`npm run build`) to be present. Run `npm run build` once before executing the user test.

---

## Build

Compiles TypeScript source from `src/` to JavaScript in `dist/`:

```bash
npm run build
```

Watch mode (rebuilds on file change):

```bash
npm run build:watch
```

Clean build output:

```bash
npm run clean
```

The compiled `dist/` output includes:
- `dist/index.js` — CommonJS entry point
- `dist/index.d.ts` — TypeScript declarations
- `dist/*.js.map` — Source maps for debugging

---

## License

MIT
