import { useMemo, useState } from 'react';
import { BadgeCheck, Clock3, Database, Music2, Search, SlidersHorizontal } from 'lucide-react';
import { songs } from './data/songs';

const voicings = ['すべて', ...Array.from(new Set(songs.map((song) => song.voicing)))];

export default function App() {
  const [query, setQuery] = useState('');
  const [voicing, setVoicing] = useState('すべて');
  const [maxDifficulty, setMaxDifficulty] = useState(5);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return songs.filter((song) => {
      const searchable = [song.title, song.titleKana, song.lyricist, song.composer, song.arranger, ...song.moods].join(' ').toLowerCase();
      return (!normalized || searchable.includes(normalized))
        && (voicing === 'すべて' || song.voicing === voicing)
        && song.difficulty <= maxDifficulty;
    });
  }, [query, voicing, maxDifficulty]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top"><Database size={22} /><span>ChorusDB<span className="jp">JP</span></span></a>
        <nav><a href="#songs">曲を探す</a><a href="#about">このサイトについて</a></nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><Music2 size={16} /> 日本の合唱曲データベース</div>
        <h1>歌いたい曲を、<br /><span>条件から見つける。</span></h1>
        <p>編成・難易度・雰囲気・用途から、日本の合唱曲を横断検索。</p>
        <div className="searchbox"><Search size={22} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="曲名、作曲者、作詞者で検索" /></div>
      </section>

      <section className="catalog" id="songs">
        <aside className="filters">
          <h2><SlidersHorizontal size={19} /> 絞り込み</h2>
          <label>編成<select value={voicing} onChange={(event) => setVoicing(event.target.value)}>{voicings.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>難易度：{maxDifficulty}以下<input type="range" min="1" max="5" value={maxDifficulty} onChange={(event) => setMaxDifficulty(Number(event.target.value))} /></label>
          <button onClick={() => { setQuery(''); setVoicing('すべて'); setMaxDifficulty(5); }}>条件をリセット</button>
        </aside>

        <div className="results">
          <div className="results-head"><div><span className="count">{filtered.length}</span> 曲見つかりました</div><small>収録情報は順次検証中です</small></div>
          <div className="grid">
            {filtered.map((song) => (
              <article className="card" key={song.id}>
                <div className="card-top"><span className="pill">{song.voicing}</span><span className="verified"><BadgeCheck size={14} />{song.verificationStatus}</span></div>
                <h3>{song.title}</h3>
                <p className="credits">作詞：{song.lyricist}<br />作曲：{song.composer}{song.arranger ? `　編曲：${song.arranger}` : ''}</p>
                <p>{song.description}</p>
                <div className="meta"><span><Clock3 size={15} />約{song.durationMinutes}分</span><span>難易度 {'★'.repeat(song.difficulty)}{'☆'.repeat(5 - song.difficulty)}</span></div>
                <div className="tags">{song.moods.map((mood) => <span key={mood}>{mood}</span>)}</div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && <div className="empty">条件に合う曲がありません。</div>}
        </div>
      </section>

      <section className="about" id="about"><h2>選曲を、もっと確かに。</h2><p>ChorusDBJPは、合唱曲のメタデータと出典を整理し、学校・団体の選曲を支援するオープンなプロジェクトです。</p></section>
      <footer>© 2026 ChorusDBJP</footer>
    </main>
  );
}
