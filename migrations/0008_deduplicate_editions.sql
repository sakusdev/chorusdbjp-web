-- Remove duplicate edition rows created when legacy extra-NNN works were merged
-- into an already existing title-based work.
--
-- Preserve genuinely different arrangements, voicings, accompaniment types,
-- publishers and sources. Prefer a verified edition over an otherwise matching
-- unverified placeholder.

DELETE FROM editions AS placeholder
WHERE placeholder.verification_status != 'verified'
  AND EXISTS (
    SELECT 1
    FROM editions AS verified
    WHERE verified.work_id = placeholder.work_id
      AND verified.id != placeholder.id
      AND verified.verification_status = 'verified'
      AND verified.voicing = placeholder.voicing
      AND verified.accompaniment = placeholder.accompaniment
      AND COALESCE(verified.arranger, '') = COALESCE(placeholder.arranger, '')
      AND (
        placeholder.publisher IS NULL
        OR placeholder.publisher = ''
        OR COALESCE(verified.publisher, '') = COALESCE(placeholder.publisher, '')
      )
      AND (
        placeholder.source_url IS NULL
        OR placeholder.source_url = ''
        OR COALESCE(verified.source_url, '') = COALESCE(placeholder.source_url, '')
      )
  );

-- Remove rows that are fully identical apart from their auto-increment ID.
DELETE FROM editions
WHERE id IN (
  SELECT duplicate_id
  FROM (
    SELECT
      id AS duplicate_id,
      ROW_NUMBER() OVER (
        PARTITION BY
          work_id,
          COALESCE(arranger, ''),
          voicing,
          accompaniment,
          COALESCE(duration_seconds, -1),
          COALESCE(difficulty, -1),
          COALESCE(publisher, ''),
          COALESCE(source_url, ''),
          verification_status
        ORDER BY id
      ) AS duplicate_rank
    FROM editions
  )
  WHERE duplicate_rank > 1
);

-- Diagnostic view used from the D1 console. More than one row is valid only
-- when the work really has multiple editions or arrangements.
CREATE VIEW IF NOT EXISTS catalog_duplicate_candidates AS
SELECT
  w.id AS work_id,
  w.title,
  COUNT(*) AS edition_count,
  SUM(CASE WHEN e.verification_status = 'verified' THEN 1 ELSE 0 END) AS verified_count,
  GROUP_CONCAT(e.id) AS edition_ids
FROM works AS w
JOIN editions AS e ON e.work_id = w.id
GROUP BY w.id, w.title
HAVING COUNT(*) > 1;
