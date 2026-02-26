import { getDate } from './getDate';
export { getDate };
export type { GetDateOptions, GetDateResult } from './types';

// Allow direct execution for testing: `node dist/index.js`
// Not promoted as a command-line tool.
if (require.main === module) {
  getDate({ silent: false });
}
