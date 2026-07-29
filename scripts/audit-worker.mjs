import { readFile } from 'node:fs/promises';

const worker = await readFile(new URL('../worker/src/index.ts', import.meta.url), 'utf8');
const wrangler = JSON.parse(await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));

const errors = [];
const warnings = [];

if (wrangler.main !== 'worker/src/index.ts') {
  errors.push(`wrangler main must be worker/src/index.ts, got ${wrangler.main}`);
}

const auditionLabel = 'YouTubeで試聴を探す';
const auditionCount = worker.split(auditionLabel).length - 1;
if (auditionCount !== 1) {
  errors.push(`audition action must be implemented exactly once, found ${auditionCount}`);
}

for (const forbidden of [
  '/api/setup/seed-extra',
  'const extraSongData',
  "id LIKE 'extra-%'",
  'new HTMLRewriter()',
]) {
  if (worker.includes(forbidden)) errors.push(`forbidden legacy implementation found: ${forbidden}`);
}

if (!worker.includes("url.pathname === '/api/stats'")) {
  warnings.push('stats endpoint was not found');
}
if (!worker.includes('verification_status')) {
  errors.push('verification status is not exposed by the worker');
}
if (!worker.includes('content-security-policy')) {
  warnings.push('content security policy header was not found');
}

console.log('Worker audit');
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length) {
  console.error(`Worker audit failed with ${errors.length} error(s)`);
  process.exit(1);
}

console.log(`Worker audit passed with ${warnings.length} warning(s)`);
