-- Replace temporary public IDs such as extra-093 with readable title-based IDs.
-- This keeps the existing metadata and edition rows intact.

INSERT OR IGNORE INTO works (
  id,
  title,
  title_kana,
  lyricist,
  composer,
  description,
  published,
  created_at,
  updated_at
)
SELECT
  title,
  title,
  title_kana,
  lyricist,
  composer,
  description,
  published,
  created_at,
  updated_at
FROM works
WHERE id LIKE 'extra-%';

UPDATE editions
SET work_id = (
  SELECT old_work.title
  FROM works AS old_work
  WHERE old_work.id = editions.work_id
)
WHERE work_id LIKE 'extra-%';

DELETE FROM works
WHERE id LIKE 'extra-%';
