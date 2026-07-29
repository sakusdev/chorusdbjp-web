import { readdir, readFile } from 'node:fs/promises';

const errors = [];
const warnings = [];
const migrationsDir = new URL('../migrations/', import.meta.url);
const migrationNames = (await readdir(migrationsDir))
  .filter((name) => name.endsWith('.sql'))
  .sort();

if (migrationNames.length === 0) {
  errors.push('No SQL migrations found');
}

let previousNumber = 0;
let combinedSql = '';
for (const name of migrationNames) {
  const match = name.match(/^(\d{4})_[a-z0-9_-]+\.sql$/);
  if (!match) {
    errors.push(`${name}: migration filename must match 0000_name.sql`);
    continue;
  }

  const number = Number(match[1]);
  if (number <= previousNumber) {
    errors.push(`${name}: migration numbers must be strictly increasing`);
  }
  previousNumber = number;

  const sql = await readFile(new URL(name, migrationsDir), 'utf8');
  combinedSql += `\n-- ${name}\n${sql}`;

  if (/\bBEGIN\s+(?:TRANSACTION|IMMEDIATE|EXCLUSIVE)\b/i.test(sql)) {
    errors.push(`${name}: explicit transaction statements are not compatible with D1 Console imports`);
  }
  if (/\bCOMMIT\s*;/i.test(sql)) {
    errors.push(`${name}: COMMIT must not be included in D1 Console-compatible migrations`);
  }
  if (/CREATE\s+TEMP(?:ORARY)?\s+TABLE/i.test(sql)) {
    errors.push(`${name}: temporary tables are not allowed in D1 Console-compatible migrations`);
  }
  if (/INSERT\s+(?:OR\s+IGNORE\s+)?INTO\s+works[\s\S]{0,300}['"]extra-\d+/i.test(sql)) {
    warnings.push(`${name}: legacy extra-NNN IDs are present; keep a matching work_aliases entry`);
  }
}

if (!/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+work_aliases/i.test(combinedSql)) {
  errors.push('work_aliases table migration is missing');
}
if (!/alias\s+TEXT\s+PRIMARY\s+KEY/i.test(combinedSql)) {
  errors.push('work_aliases.alias must be a primary key');
}
if (!/REFERENCES\s+works\s*\(id\)\s+ON\s+DELETE\s+CASCADE/i.test(combinedSql)) {
  errors.push('work_aliases.work_id must reference works(id) with ON DELETE CASCADE');
}

const verificationUrl = new URL('../data/author-verification.tsv', import.meta.url);
let verifiedRows = [];
try {
  const tsv = await readFile(verificationUrl, 'utf8');
  const lines = tsv.split(/\r?\n/).filter(Boolean);
  const expectedHeader = 'id\ttitle\tlyricist\tcomposer\tvoicing\tsource\tstatus';
  if (lines[0] !== expectedHeader) {
    errors.push('data/author-verification.tsv: unexpected header');
  }

  verifiedRows = lines.slice(1).map((line, index) => {
    const fields = line.split('\t');
    if (fields.length !== 7) {
      errors.push(`author-verification.tsv line ${index + 2}: expected 7 columns`);
    }
    const [id, title, lyricist, composer, voicing, source, status] = fields;
    if (!id || !title || !source || !status) {
      errors.push(`author-verification.tsv line ${index + 2}: required field is empty`);
    }
    if (source && !/^https:\/\//.test(source)) {
      errors.push(`${title || `line ${index + 2}`}: source must use HTTPS`);
    }
    if (status === 'verified' && (!lyricist || !composer || !voicing)) {
      errors.push(`${title}: verified records require lyricist, composer, and voicing`);
    }
    if (/^extra-\d{3}$/.test(id)) {
      warnings.push(`${id}: verification data still uses a legacy generated ID`);
    }
    return { id, title, status };
  });

  const ids = new Set();
  for (const row of verifiedRows) {
    if (ids.has(row.id)) errors.push(`${row.id}: duplicate verification ID`);
    ids.add(row.id);
  }
} catch (error) {
  errors.push(`Unable to read data/author-verification.tsv: ${error.message}`);
}

console.log(`Catalog audit: ${migrationNames.length} migrations and ${verifiedRows.length} verification rows checked`);
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) {
  console.error(`Catalog audit failed with ${errors.length} error(s)`);
  process.exit(1);
}

console.log(`Catalog audit passed with ${warnings.length} warning(s)`);
