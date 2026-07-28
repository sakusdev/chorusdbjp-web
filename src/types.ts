export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Song {
  id: string;
  title: string;
  titleKana: string;
  lyricist: string;
  composer: string;
  arranger?: string;
  voicing: string;
  accompaniment: 'ピアノ' | '無伴奏' | 'その他';
  durationMinutes: number;
  difficulty: Difficulty;
  recommendedGrades: string[];
  moods: string[];
  occasions: string[];
  description: string;
  verificationStatus: '未確認' | '確認中' | '確認済み';
}
