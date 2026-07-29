-- ChorusDBJP catalog review queries
-- Run individual statements in Cloudflare D1 Console.

-- 1. Overall quality summary
SELECT
  COUNT(DISTINCT w.id) AS published_works,
  COUNT(DISTINCT CASE WHEN e.verification_status = 'verified' THEN w.id END) AS verified_works,
  COUNT(DISTINCT CASE WHEN e.verification_status != 'verified' THEN w.id END) AS unverified_works,
  COUNT(DISTINCT CASE WHEN NULLIF(TRIM(e.source_url), '') IS NULL THEN w.id END) AS missing_source,
  COUNT(DISTINCT CASE WHEN NULLIF(TRIM(w.composer), '') IS NULL THEN w.id END) AS missing_composer
FROM works w
JOIN editions e ON e.work_id = w.id
WHERE w.published = 1;

-- 2. Records that must be reviewed first
SELECT
  w.id,
  w.title,
  w.lyricist,
  w.composer,
  w.work_type,
  e.voicing,
  e.verification_status,
  e.source_url
FROM works w
JOIN editions e ON e.work_id = w.id
WHERE w.published = 1
  AND (
    e.verification_status != 'verified'
    OR NULLIF(TRIM(e.source_url), '') IS NULL
    OR NULLIF(TRIM(w.composer), '') IS NULL
  )
ORDER BY
  CASE WHEN NULLIF(TRIM(w.composer), '') IS NULL THEN 0 ELSE 1 END,
  w.title_kana,
  w.title;

-- 3. Legacy temporary IDs still remaining
SELECT id, title
FROM works
WHERE id LIKE 'extra-%'
ORDER BY id;

-- 4. Ambiguous titles requiring author/source disambiguation
SELECT w.id, w.title, w.lyricist, w.composer, e.source_url, e.verification_status
FROM works w
JOIN editions e ON e.work_id = w.id
WHERE w.title IN ('道','空','風','川','夏','卒業','奇跡','約束','ひかり','手紙','ありがとう')
ORDER BY w.title, w.composer;

-- 5. Published records that are not individual songs
SELECT id, title, work_type, published
FROM works
WHERE published = 1 AND work_type != 'song'
ORDER BY work_type, title;

-- 6. Verified records missing provenance metadata
SELECT w.id, w.title, e.source_url, e.source_checked_at, e.verification_notes
FROM works w
JOIN editions e ON e.work_id = w.id
WHERE e.verification_status = 'verified'
  AND (
    NULLIF(TRIM(e.source_url), '') IS NULL
    OR NULLIF(TRIM(e.source_checked_at), '') IS NULL
  )
ORDER BY w.title;
