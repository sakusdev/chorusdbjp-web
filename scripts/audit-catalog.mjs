import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../worker/src/index.ts', import.meta.url), 'utf8');
const match = source.match(/const extraSongData = `([\s\S]*?)`;/);

if (!match) {
  console.error('ERROR: extraSongData was not found in worker/src/index.ts');
  process.exit(1);
}

const rows = match[1]
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line, index) => {
    const [title, voicing, difficulty] = line.split('|');
    return { index: index + 1, title, voicing, difficulty: Number(difficulty) };
  });

const errors = [];
const warnings = [];
const titleCounts = new Map();
const ambiguousTitles = new Set([
  '道', '空', '風', '川', '夏', '卒業', '奇跡', '約束', 'ひかり', '手紙', 'ありがとう',
]);
const knownLegacyCollections = new Set(['光と風をつれて', 'ふるさとの四季', '心の四季']);

for (const row of rows) {
  if (!row.title || !row.voicing || !Number.isInteger(row.difficulty)) {
    errors.push(`#${row.index}: malformed row`);
    continue;
  }
  if (row.difficulty < 1 || row.difficulty > 5) {
    errors.push(`${row.title}: difficulty must be between 1 and 5`);
  }
  titleCounts.set(row.title, (titleCounts.get(row.title) ?? 0) + 1);
  if (ambiguousTitles.has(row.title)) {
    warnings.push(`${row.title}: title is ambiguous; author/source verification is required`);
  }
  if (knownLegacyCollections.has(row.title)) {
    warnings.push(`${row.title}: legacy collection/suite record must stay unpublished until normalized`);
  }
}

for (const [title, count] of titleCounts) {
  if (count > 1) errors.push(`${title}: duplicate title appears ${count} times`);
}

if (rows.length !== 150) {
  warnings.push(`extraSongData contains ${rows.length} rows; expected 150`);
}

console.log(`Catalog audit: ${rows.length} extra records checked`);
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) {
  console.error(`Catalog audit failed with ${errors.length} error(s)`);
  process.exit(1);
}

console.log(`Catalog audit passed with ${warnings.length} warning(s)`);
