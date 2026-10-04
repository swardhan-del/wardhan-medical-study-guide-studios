import { readFileSync } from 'node:fs';
import { checkOutput, checkRepository, makePolicy } from './privacy-boundary.mjs';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const policy = makePolicy(read('scripts/private-intake-fingerprints.json'), read('src/content/public-release.json').assets);
const output = process.argv.includes('--output');
const result = output ? checkOutput(process.cwd(), policy) : checkRepository(process.cwd(), policy);
if (output && result.fileCount === 0) result.errors.push('No deployment output found; run the build first');
if (result.errors.length) {
  console.error(result.errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Privacy boundary passed: ${result.fileCount} ${output ? 'deployment' : 'repository'} files; ${output ? 'traces, rendered pages and bundles' : result.indexChecked ? 'working tree and Git index' : 'deployment snapshot (Git index checked in CI)'}.`);
