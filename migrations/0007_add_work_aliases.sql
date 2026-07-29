-- Preserve old public URLs when work IDs are renamed.
-- Alias lookup support is added separately in the Worker API.

CREATE TABLE IF NOT EXISTS work_aliases (
  alias TEXT PRIMARY KEY,
  work_id TEXT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_work_aliases_work_id
  ON work_aliases(work_id);

-- Known legacy links that have already appeared publicly.
INSERT OR IGNORE INTO work_aliases (alias, work_id, reason)
SELECT 'extra-093', id, 'legacy generated ID'
FROM works
WHERE id = 'Soranji';

INSERT OR IGNORE INTO work_aliases (alias, work_id, reason)
SELECT 'extra-094', id, 'legacy generated ID'
FROM works
WHERE id = '僕のこと';

-- The unsupported 青と夏 record may remain unpublished, but its old URL should
-- still resolve to the record while corrections are being tracked.
INSERT OR IGNORE INTO work_aliases (alias, work_id, reason)
SELECT 'extra-095', id, 'legacy generated ID'
FROM works
WHERE id = '青と夏';
