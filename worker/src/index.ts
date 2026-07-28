export interface Env { DB: D1Database }

const page = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ChorusDBJP</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #0b0d12; color: #f5f7fb; }
    header { padding: 24px 18px 16px; border-bottom: 1px solid #252a35; background: #11151d; }
    h1 { margin: 0; font-size: 28px; }
    header p { margin: 8px 0 0; color: #aeb7c8; }
    main { max-width: 960px; margin: auto; padding: 18px; }
    .controls { display: grid; grid-template-columns: 1fr 180px; gap: 10px; margin-bottom: 16px; }
    input, select { width: 100%; border: 1px solid #343b4a; border-radius: 12px; padding: 13px 14px; background: #171c25; color: inherit; font-size: 16px; }
    .status { color: #aeb7c8; margin: 10px 2px 16px; }
    .grid { display: grid; gap: 12px; }
    .card { border: 1px solid #29303d; border-radius: 16px; background: #131821; padding: 16px; }
    .card h2 { margin: 0 0 8px; font-size: 20px; }
    .meta { color: #b7c0cf; line-height: 1.7; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
    .tag { background: #202737; border-radius: 999px; padding: 5px 9px; font-size: 13px; }
    .empty { padding: 28px; text-align: center; color: #aeb7c8; border: 1px dashed #343b4a; border-radius: 16px; }
    @media (max-width: 640px) { .controls { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header>
    <h1>ChorusDBJP</h1>
    <p>日本の合唱曲を、編成・難易度・作者から探せるデータベース</p>
  </header>
  <main>
    <section class="controls">
      <input id="query" type="search" placeholder="曲名・作詞者・作曲者で検索" />
      <select id="voicing"><option value="">すべての編成</option></select>
    </section>
    <div id="status" class="status">読み込み中...</div>
    <section id="results" class="grid"></section>
  </main>
  <script>
    const state = { songs: [] };
    const query = document.getElementById('query');
    const voicing = document.getElementById('voicing');
    const status = document.getElementById('status');
    const results = document.getElementById('results');

    function esc(value) {
      return String(value ?? '').replace(/[&<>\"']/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' })[c];
      });
    }

    function card(song) {
      const lyricist = song.lyricist ? '作詞：' + esc(song.lyricist) + '<br>' : '';
      const tags = [
        song.voicing ? '<span class="tag">' + esc(song.voicing) + '</span>' : '',
        song.accompaniment ? '<span class="tag">' + esc(song.accompaniment) + '</span>' : '',
        song.difficulty ? '<span class="tag">難易度 ' + esc(song.difficulty) + '</span>' : ''
      ].join('');

      return '<article class="card">' +
        '<h2>' + esc(song.title) + '</h2>' +
        '<div class="meta">' + lyricist + '作曲：' + esc(song.composer || '不明') + '</div>' +
        '<div class="tags">' + tags + '</div>' +
        '</article>';
    }

    function render() {
      const q = query.value.trim().toLowerCase();
      const v = voicing.value;
      const items = state.songs.filter(function (song) {
        const haystack = [song.title, song.title_kana, song.lyricist, song.composer].join(' ').toLowerCase();
        return (!q || haystack.includes(q)) && (!v || song.voicing === v);
      });
      status.textContent = items.length + '曲';
      results.innerHTML = items.length
        ? items.map(card).join('')
        : '<div class="empty">該当する曲がありません。</div>';
    }

    fetch('/api/songs')
      .then(function (response) {
        if (!response.ok) throw new Error('API error ' + response.status);
        return response.json();
      })
      .then(function (songs) {
        state.songs = Array.isArray(songs) ? songs : [];
        Array.from(new Set(state.songs.map(function (song) { return song.voicing; }).filter(Boolean)))
          .sort()
          .forEach(function (value) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            voicing.appendChild(option);
          });
        render();
      })
      .catch(function (error) {
        status.textContent = 'データの読み込みに失敗しました';
        results.innerHTML = '<div class="empty">D1の設定・マイグレーションを確認してください。<br>' + esc(error.message) + '</div>';
      });

    query.addEventListener('input', render);
    voicing.addEventListener('change', render);
  </script>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(page, {
        headers: { 'content-type': 'text/html; charset=UTF-8' },
      });
    }

    if (url.pathname === '/api/songs' && request.method === 'GET') {
      try {
        const result = await env.DB.prepare(`
          SELECT w.id, w.title, w.title_kana, w.lyricist, w.composer,
                 e.voicing, e.accompaniment, e.duration_seconds, e.difficulty
          FROM works w
          JOIN editions e ON e.work_id = w.id
          WHERE w.published = 1
          ORDER BY w.title_kana
        `).all();
        return Response.json(result.results);
      } catch (error) {
        return Response.json(
          { error: 'Database query failed', detail: String(error) },
          { status: 500 },
        );
      }
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  },
};
