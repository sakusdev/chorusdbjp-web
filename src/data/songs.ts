import type { Song } from '../types';

export const songs: Song[] = [
  {
    id: 'cosmos', title: 'COSMOS', titleKana: 'こすもす', lyricist: 'ミマス', composer: 'ミマス', arranger: '富澤裕',
    voicing: '混声三部', accompaniment: 'ピアノ', durationMinutes: 3.8, difficulty: 2,
    recommendedGrades: ['中学1年', '中学2年'], moods: ['壮大', '爽やか'], occasions: ['合唱祭', '卒業'],
    description: '広がりのある旋律と親しみやすいハーモニーを持つ定番曲。', verificationStatus: '確認中'
  },
  {
    id: 'shinjiru', title: '信じる', titleKana: 'しんじる', lyricist: '谷川俊太郎', composer: '松下耕',
    voicing: '混声三部', accompaniment: 'ピアノ', durationMinutes: 4.5, difficulty: 4,
    recommendedGrades: ['中学3年', '高校'], moods: ['叙情的', '力強い'], occasions: ['コンクール', '演奏会'],
    description: '言葉の深さと繊細な響きを両立させる表現力の高い作品。', verificationStatus: '確認中'
  },
  {
    id: 'niji', title: '虹', titleKana: 'にじ', lyricist: '森山直太朗・御徒町凧', composer: '森山直太朗・御徒町凧', arranger: '信長貴富',
    voicing: '混声三部', accompaniment: 'ピアノ', durationMinutes: 4.6, difficulty: 3,
    recommendedGrades: ['中学2年', '中学3年'], moods: ['温かい', '感動的'], occasions: ['合唱祭', '卒業'],
    description: '伸びやかな旋律とドラマティックな展開が魅力。', verificationStatus: '確認中'
  },
  {
    id: 'kikoeru', title: '聞こえる', titleKana: 'きこえる', lyricist: '岩間芳樹', composer: '新実徳英',
    voicing: '混声三部', accompaniment: 'ピアノ', durationMinutes: 4.8, difficulty: 4,
    recommendedGrades: ['中学3年', '高校'], moods: ['劇的', '社会的'], occasions: ['コンクール', '演奏会'],
    description: '強いメッセージ性と緊張感のある音楽展開を持つ作品。', verificationStatus: '確認中'
  },
  {
    id: 'sono-hito-ga-utau-toki', title: 'そのひとがうたうとき', titleKana: 'そのひとがうたうとき', lyricist: '谷川俊太郎', composer: '木下牧子',
    voicing: '混声四部', accompaniment: 'ピアノ', durationMinutes: 4.5, difficulty: 4,
    recommendedGrades: ['高校', '一般'], moods: ['静か', '叙情的', '温かい'], occasions: ['コンクール', '演奏会'],
    description: '詩と音楽が密接に結びついた、透明感のある合唱作品。', verificationStatus: '確認中'
  }
];
