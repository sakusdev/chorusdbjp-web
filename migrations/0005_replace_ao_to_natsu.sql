-- Remove an unsupported entry and replace it with a verified choral work.
UPDATE works
SET published = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE title = '青と夏';

INSERT OR IGNORE INTO works (
  id,
  title,
  title_kana,
  lyricist,
  composer,
  published
) VALUES (
  'seikai-radwimps',
  '正解',
  'せいかい',
  '野田洋次郎',
  '野田洋次郎',
  1
);

INSERT INTO editions (
  work_id,
  arranger,
  voicing,
  accompaniment,
  difficulty,
  publisher,
  source_url,
  verification_status
)
SELECT
  'seikai-radwimps',
  NULL,
  '混声三部',
  'ピアノ',
  3,
  'RADWIMPS',
  'https://radwimps.jp/music/14753/',
  'verified'
WHERE NOT EXISTS (
  SELECT 1 FROM editions WHERE work_id = 'seikai-radwimps'
);
