CREATE TABLE works (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_kana TEXT NOT NULL,
  lyricist TEXT,
  composer TEXT NOT NULL,
  description TEXT,
  published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE editions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id TEXT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  arranger TEXT,
  voicing TEXT NOT NULL,
  accompaniment TEXT NOT NULL,
  duration_seconds INTEGER,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  publisher TEXT,
  source_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified'
);

CREATE INDEX idx_works_title_kana ON works(title_kana);
CREATE INDEX idx_editions_work_id ON editions(work_id);
CREATE INDEX idx_editions_voicing ON editions(voicing);
