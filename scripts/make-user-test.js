'use strict';

/**
 * scripts/make-user-test.js
 *
 * Interactive walkthrough that generates tests/userTest.js.
 * Run via: npm run test:make-user-test
 *
 * Controls:
 *   ↑ / ↓   navigate options
 *   Enter   confirm selection
 *   y       shortcut for "Yes"
 *   n       shortcut for "No"  (also the Enter default on yes/no prompts)
 *   Ctrl+C  abort
 */

const fs   = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'tests', 'userTest.js');

// ── All available getDate option calls ────────────────────────────────────────
const ALL_OPTIONS = [
  { label: 'default call                  · { date, twoDigitDate, lastMonth, month, quarter, year }', code: 'console.log(getDate());' },
  { label: 'full                          · fullDate MM-DD-YYYY',                                     code: 'console.log(getDate({ full: true }));' },
  { label: 'slash                         · date MM/DD/YY',                                           code: 'console.log(getDate({ slash: true }));' },
  { label: 'slash + alternateVar          · slashDate MM/DD/YY',                                      code: 'console.log(getDate({ slash: true, alternateVar: true }));' },
  { label: "slash + customVar             · result['myDate'] MM/DD/YY",                               code: "console.log(getDate({ slash: true, customVar: 'myDate' }));" },
  { label: 'day                           · day (DD) + date (MM-DD-YY)',                              code: 'console.log(getDate({ day: true }));' },
  { label: 'day + dayMonth                · day + monthNumber + date',                                code: 'console.log(getDate({ day: true, dayMonth: true }));' },
  { label: 'lastMonth                     · last month name',                                         code: 'console.log(getDate({ lastMonth: true }));' },
  { label: 'lastMonth + abbreviated       · abbreviated last month',                                  code: 'console.log(getDate({ lastMonth: true, abbreviated: true }));' },
  { label: 'lastQuarter  (independent)    · last quarter 1–4',                                       code: 'console.log(getDate({ lastQuarter: true }));' },
  { label: 'lastYear                      · last year YYYY',                                          code: 'console.log(getDate({ lastYear: true }));' },
  { label: 'month                         · month name',                                              code: 'console.log(getDate({ month: true }));' },
  { label: 'month + abbreviated           · abbreviated month name',                                  code: 'console.log(getDate({ month: true, abbreviated: true }));' },
  { label: 'nextYear  (independent)       · next year YYYY',                                         code: 'console.log(getDate({ nextYear: true }));' },
  { label: 'quarter                       · quarter number 1–4',                                      code: 'console.log(getDate({ quarter: true }));' },
  { label: 'quarter + season              · season name',                                             code: 'console.log(getDate({ quarter: true, season: true }));' },
  { label: 'terminalDate  (independent)   · MM/DD/YYYY',                                             code: 'console.log(getDate({ terminalDate: true }));' },
  { label: "terminalDate + order d-m-y  (independent)  · DD/MM/YYYY",                               code: "console.log(getDate({ terminalDate: true, order: 'd-m-y' }));" },
  { label: "terminalDate + order y-m-d  (independent)  · YYYY/MM/DD",                               code: "console.log(getDate({ terminalDate: true, order: 'y-m-d' }));" },
  { label: 'year                          · four-digit year YYYY',                                    code: 'console.log(getDate({ year: true }));' },
  { label: 'year + twoDigit               · two-digit year YY',                                       code: 'console.log(getDate({ year: true, twoDigit: true }));' },
  { label: 'leap  (independent)           · checkLeapYear 1 or 0',                                   code: 'console.log(getDate({ leap: true }));' },
  { label: 'clearVars  (independent)      · reset — returns {}',                                     code: 'console.log(getDate({ clearVars: true }));' },
];

// ── ANSI helpers ──────────────────────────────────────────────────────────────
const R  = '\x1b[0m';       // reset
const B  = '\x1b[1m';       // bold
const DM = '\x1b[2m';       // dim
const CY = '\x1b[36m';      // cyan
const GR = '\x1b[32m';      // green
const HL = '\x1b[7m';       // reverse-video (highlight selected row)

const HIDE_CURSOR = '\x1b[?25l';
const SHOW_CURSOR = '\x1b[?25h';
const ERASE_LINE  = '\x1b[2K';
const CURSOR_UP   = '\x1b[1A';

function eraseLine()  { process.stdout.write(ERASE_LINE + '\r'); }
function cursorUp()   { process.stdout.write(CURSOR_UP); }
function eraseLines(n) { for (let i = 0; i < n; i++) { cursorUp(); eraseLine(); } }

// ── Generic arrow-key dropdown ────────────────────────────────────────────────
// Returns a Promise<number> with the chosen index.
function dropdown(promptText, items, defaultIndex = 0) {
  return new Promise((resolve) => {
    let idx = Math.max(0, Math.min(defaultIndex, items.length - 1));
    const count = items.length;
    // +2: prompt line + footer line  +1: blank line before prompt
    const FRAME_LINES = count + 3;

    function render() {
      process.stdout.write('\n');
      process.stdout.write(`${B}${CY}${promptText}${R}\n`);
      for (let i = 0; i < count; i++) {
        const lbl = typeof items[i] === 'string' ? items[i] : items[i].label;
        if (i === idx) {
          process.stdout.write(`  ${HL} › ${lbl} ${R}\n`);
        } else {
          process.stdout.write(`  ${DM}   ${lbl}${R}\n`);
        }
      }
      process.stdout.write(`${DM}  ↑↓ navigate  ·  Enter select${R}\n`);
    }

    function redraw() {
      eraseLines(FRAME_LINES);
      render();
    }

    process.stdout.write(HIDE_CURSOR);
    render();

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', onKey);

    function onKey(buf) {
      const key = buf.toString();
      if (key === '\x1b[A') {                          // ↑
        idx = (idx - 1 + count) % count;
        redraw();
      } else if (key === '\x1b[B') {                   // ↓
        idx = (idx + 1) % count;
        redraw();
      } else if (key === '\r' || key === '\n') {        // Enter
        done();
      } else if (key === '\x03') {                      // Ctrl+C
        abort();
      }
    }

    function done() {
      process.stdin.removeListener('data', onKey);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write(SHOW_CURSOR);
      eraseLines(FRAME_LINES);
      const lbl = typeof items[idx] === 'string' ? items[idx] : items[idx].label;
      process.stdout.write(`  ${GR}${B}✔${R} ${lbl}\n`);
      resolve(idx);
    }

    function abort() {
      process.stdin.removeListener('data', onKey);
      process.stdin.setRawMode(false);
      process.stdout.write(SHOW_CURSOR + '\nAborted.\n');
      process.exit(1);
    }
  });
}

// ── "Add another line?" yes/no prompt ────────────────────────────────────────
// y → true, n/Enter → false.  Arrow keys also work to navigate.
function confirmAddAnother() {
  const items   = ['Yes – add another option', 'No  – finish writing the test'];
  const NO_IDX  = 1;

  return new Promise((resolve) => {
    let idx = NO_IDX;   // default to No
    const count = items.length;
    const FRAME_LINES = count + 3;

    function render() {
      process.stdout.write('\n');
      process.stdout.write(`${B}${CY}Add another line to the test?${R}\n`);
      for (let i = 0; i < count; i++) {
        if (i === idx) {
          process.stdout.write(`  ${HL} › ${items[i]} ${R}\n`);
        } else {
          process.stdout.write(`  ${DM}   ${items[i]}${R}\n`);
        }
      }
      process.stdout.write(`${DM}  ↑↓ navigate  ·  y = Yes  ·  n = No  ·  Enter confirms selection${R}\n`);
    }

    function redraw() {
      eraseLines(FRAME_LINES);
      render();
    }

    process.stdout.write(HIDE_CURSOR);
    render();

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', onKey);

    function onKey(buf) {
      const key = buf.toString();
      if (key === '\x1b[A') {                          // ↑
        idx = (idx - 1 + count) % count;
        redraw();
      } else if (key === '\x1b[B') {                   // ↓
        idx = (idx + 1) % count;
        redraw();
      } else if (key === 'y' || key === 'Y') {
        done(true,  'Yes – add another option');
      } else if (key === 'n' || key === 'N') {
        done(false, 'No  – finish writing the test');
      } else if (key === '\r' || key === '\n') {          // Enter confirms current selection
        done(idx === 0, items[idx]);
      } else if (key === '\x03') {                      // Ctrl+C
        process.stdin.removeListener('data', onKey);
        process.stdin.setRawMode(false);
        process.stdout.write(SHOW_CURSOR + '\nAborted.\n');
        process.exit(1);
      }
    }

    function done(result, label) {
      process.stdin.removeListener('data', onKey);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write(SHOW_CURSOR);
      eraseLines(FRAME_LINES);
      process.stdout.write(`  ${GR}${B}✔${R} ${label}\n`);
      resolve(result);
    }
  });
}

// ── Write the test file ───────────────────────────────────────────────────────
function writeTestFile(codeLines) {
  const header = [
    `'use strict';`,
    ``,
    `// Run with:        npm run test:user`,
    `// Regenerate with: npm run test:make-user-test`,
    ``,
    `const { getDate } = require('../dist/index.js');`,
    ``,
  ];
  const footer = [
    ``,
    `console.log('User test complete');`,
  ];
  const content = [...header, ...codeLines, ...footer].join('\n');
  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  process.stdout.write(`\n${GR}${B}Created:${R} ${OUTPUT_FILE}\n`);
}

// ── Build the all-commented-out template ──────────────────────────────────────
function buildTemplate() {
  const lines = ALL_OPTIONS.map(opt => `// ${opt.code}`);
  writeTestFile(lines);
  process.stdout.write(`${DM}All available options are commented out. Uncomment lines to test them.${R}\n\n`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  process.stdout.write(`\n${B}getDate – make-user-test${R}\n`);
  process.stdout.write(`${DM}Creates tests/userTest.js for manual CLI testing.${R}\n`);

  const startIdx = await dropdown(
    'Use create userTest.js walkthrough or end process?',
    [
      'Use walkthrough – choose options interactively',
      'End process     – create template with all options commented out',
    ],
    0
  );

  if (startIdx === 1) {
    buildTemplate();
    return;
  }

  // ── Walkthrough ─────────────────────────────────────────────────────────────
  const selectedLines = [];

  while (true) {
    const optIdx = await dropdown('Select an option to add to the test:', ALL_OPTIONS, 0);
    selectedLines.push(ALL_OPTIONS[optIdx].code);

    if (selectedLines.length >= ALL_OPTIONS.length) {
      process.stdout.write(`\n${DM}All options added.${R}\n`);
      break;
    }

    const addMore = await confirmAddAnother();
    if (!addMore) break;
  }

  writeTestFile(selectedLines);
  process.stdout.write(`${DM}Run it with: npm run test:user${R}\n\n`);
}

main().catch((err) => {
  process.stdout.write(SHOW_CURSOR);
  process.stderr.write(`\nError: ${err.message}\n`);
  process.exit(1);
});
