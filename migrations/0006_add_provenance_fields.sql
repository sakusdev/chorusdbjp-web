-- Add provenance and work classification fields.
-- Compatible with Cloudflare D1 Console: no explicit transaction required.

ALTER TABLE works ADD COLUMN work_type TEXT NOT NULL DEFAULT 'song';
ALTER TABLE editions ADD COLUMN source_checked_at TEXT;
ALTER TABLE editions ADD COLUMN verification_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_works_work_type ON works(work_type);
CREATE INDEX IF NOT EXISTS idx_editions_verification_status ON editions(verification_status);
CREATE INDEX IF NOT EXISTS idx_editions_source_checked_at ON editions(source_checked_at);

-- Normalize records already identified as collections/suites.
UPDATE works
SET work_type = 'collection', published = 0, updated_at = CURRENT_TIMESTAMP
WHERE title IN ('光と風をつれて', 'ふるさとの四季', '心の四季');

-- Stamp currently verified records with the migration date when no date exists.
UPDATE editions
SET source_checked_at = COALESCE(source_checked_at, '2026-07-29'),
    verification_notes = COALESCE(verification_notes, '公式出版社または公式楽譜情報で確認')
WHERE verification_status = 'verified';
