export interface Env { DB: D1Database }

const page = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0b0d12" />
  <title>ChorusDBJP</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, "Noto Sans JP", system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #090b10; color: #f6f7fb; }
    button, input, select { font: inherit; }
    header { position: sticky; top: 0; z-index: 10; padding: 20px 18px 15px; border-bottom: 1px solid #242936; background: rgba(14,17,24,.94); backdrop-filter: blur(14px); }
    .head { max-width: 1080px; margin: auto; display: flex; justify-content: space-between; gap: 18px; align-items: center; }
    h1 { margin: 0; font-size: 26px; letter-spacing: -.03em; }
    header p { margin: 5px 0 0; color: #aeb7c8; font-size: 14px; }
    .count-badge { flex: none; border: 1px solid #333b4d; border-radius: 999px; padding: 7px 11px; color: #dce3ef; background: #171c26; font-size: 13px; }
    main { max-width: 1080px; margin: auto; padding: 20px 18px 60px; }
    .panel { border: 1px solid #272d3a; border-radius: 18px; background: #11151d; padding: 14px; box-shadow: 0 14px 40px rgba(0,0,0,.16); }
    .controls { display: grid; grid-template-columns: minmax(240px, 1fr) repeat(3, minmax(140px, 190px)); gap: 10px; }
    input, select { width: 100%; min-height: 45px; border: 1px solid #343b4a; border-radius: 11px; padding: 11px 13px; background: #171c25; color: inherit; outline: none; }
    input:focus, select:focus { border-color: #7183ff; box-shadow: 0 0 0 3px rgba(113,131,255,.15); }
    .summary { display: flex; justify-content: space-between; align-items: center; gap: 10px; color: #aeb7c8; margin: 16px 2px 12px; font-size: 14px; }
    .reset { border: 0; background: transparent; color: #aab8ff; padding: 6px; cursor: pointer; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .card { position: relative; border: 1px solid #29303d; border-radius: 16px; background: #121720; padding: 17px; cursor: pointer; transition: transform .15s ease, border-color .15s ease, background .15s ease; }
    .card:hover { transform: translateY(-2px); border-color: #4b5874; background: #151b26; }
    .card:focus-visible { outline: 3px solid rgba(113,131,255,.55); outline-offset: 2px; }
    .card h2 { margin: 0 30px 9px 0; font-size: 19px; line-height: 1.35; }
    .arrow { position: absolute; right: 16px; top: 17px; color: #758099; }
    .meta { color: #b7c0cf; line-height: 1.65; font-size: 14px; }
    .tags { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 13px; }
    .tag { background: #202737; border: 1px solid #2d364a; border-radius: 999px; padding: 5px 9px; font-size: 12px; color: #dce3ef; }
    .difficulty { color: #ffd18a; }
    .empty { grid-column: 1 / -1; padding: 36px 20px; text-align: center; color: #aeb7c8; border: 1px dashed #343b4a; border-radius: 16px; }
    dialog { width: min(600px, calc(100% - 24px)); border: 1px solid #343c4d; border-radius: 20px; background: #111620; color: #f6f7fb; padding: 0; box-shadow: 0 30px 90px rgba(0,0,0,.65); }
    dialog::backdrop { background: rgba(0,0,0,.72); backdrop-filter: blur(4px); }
    .modal-head { display: flex; justify-content: space-between; gap: 16px; align-items: start; padding: 20px 20px 14px; border-bottom: 1px solid #272e3b; }
    .modal-head h2 { margin: 0; font-size: 24px; }
    .close { width: 36px; height: 36px; border: 1px solid #343c4d; border-radius: 10px; background: #1a202b; color: inherit; cursor: pointer; }
    .modal-body { padding: 18px 20px 22px; }
    .detail-grid { display: grid; grid-template-columns: 130px 1fr; gap: 10px 16px; margin: 0; }
    .detail-grid dt { color: #8f9aaf; }
    .detail-grid dd { margin: 0; line-height: 1.55; }
    .notice { margin-top: 18px; padding: 11px 12px; border-radius: 11px; background: #191f2a; color: #aeb7c8; font-size: 13px; line-height: 1.6; }
    @media (max-width: 780px) { .controls { grid-template-columns: 1fr 1fr; } .controls input { grid-column: 1 / -1; } }
    @media (max-width: 620px) { .head { align-items: start; } header p { max-width: 250px; } .controls { grid-template-columns: 1fr; } .controls input { grid-column: auto; } .grid { grid-template-columns: 1fr; } .detail-grid { grid-template-columns: 95px 1fr; } }
  </style>
</head>
<body>
  <header><div class="head"><div><h1>ChorusDBJP</h1><p>日本の合唱曲を、編成・難易度・作者から探せるデータベース</p></div><div id="total" class="count-badge">読込中</div></div></header>
  <main>
    <section class="panel controls" aria-label="検索条件">
      <input id="query" type="search" placeholder="曲名・作詞者・作曲者で検索" autocomplete="off" />
      <select id="voicing"><option value="">すべての編成</option></select>
      <select id="difficulty"><option value="">すべての難易度</option><option value="1">難易度 1</option><option value="2">難易度 2</option><option value="3">難易度 3</option><option value="4">難易度 4</option><option value="5">難易度 5</option></select>
      <select id="sort"><option value="kana">曲名順</option><option value="difficulty-asc">難易度が低い順</option><option value="difficulty-desc">難易度が高い順</option><option value="composer">作曲者順</option></select>
    </section>
    <div class="summary"><span id="status">読み込み中...</span><button id="reset" class="reset" type="button">条件をリセット</button></div>
    <section id="results" class="grid" aria-live="polite"></section>
  </main>
  <dialog id="detail"><div class="modal-head"><h2 id="detail-title"></h2><button id="close" class="close" type="button" aria-label="閉じる">×</button></div><div id="detail-body" class="modal-body"></div></dialog>
  <script>
    const state = { songs: [] };
    const query = document.getElementById('query');
    const voicing = document.getElementById('voicing');
    const difficulty = document.getElementById('difficulty');
    const sort = document.getElementById('sort');
    const status = document.getElementById('status');
    const total = document.getElementById('total');
    const results = document.getElementById('results');
    const detail = document.getElementById('detail');
    const detailTitle = document.getElementById('detail-title');
    const detailBody = document.getElementById('detail-body');

    function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
    function stars(value) { const number = Number(value || 0); return '★'.repeat(number) + '☆'.repeat(Math.max(0, 5 - number)); }
    function card(song) {
      const lyricist = song.lyricist ? '作詞：' + esc(song.lyricist) + '<br>' : '';
      const tags = [song.voicing ? '<span class="tag">' + esc(song.voicing) + '</span>' : '', song.accompaniment ? '<span class="tag">' + esc(song.accompaniment) + '</span>' : '', song.difficulty ? '<span class="tag difficulty">' + stars(song.difficulty) + '</span>' : ''].join('');
      return '<article class="card" tabindex="0" role="button" data-id="' + esc(song.id) + '"><span class="arrow">›</span><h2>' + esc(song.title) + '</h2><div class="meta">' + lyricist + '作曲：' + esc(song.composer || '不明') + '</div><div class="tags">' + tags + '</div></article>';
    }
    function currentItems() {
      const q = query.value.trim().toLowerCase(), v = voicing.value, d = difficulty.value;
      const items = state.songs.filter(function (song) { const haystack = [song.title, song.title_kana, song.lyricist, song.composer, song.arranger].join(' ').toLowerCase(); return (!q || haystack.includes(q)) && (!v || song.voicing === v) && (!d || String(song.difficulty) === d); });
      items.sort(function (a, b) { if (sort.value === 'difficulty-asc') return (a.difficulty || 99) - (b.difficulty || 99); if (sort.value === 'difficulty-desc') return (b.difficulty || 0) - (a.difficulty || 0); if (sort.value === 'composer') return String(a.composer || '').localeCompare(String(b.composer || ''), 'ja'); return String(a.title_kana || a.title).localeCompare(String(b.title_kana || b.title), 'ja'); });
      return items;
    }
    function render() { const items = currentItems(); status.textContent = state.songs.length + '曲中 ' + items.length + '曲を表示'; results.innerHTML = items.length ? items.map(card).join('') : '<div class="empty">条件に合う曲がありません。<br>検索条件を変えてみてください。</div>'; }
    function detailRows(song) {
      const rows = [['読み', song.title_kana], ['作詞', song.lyricist], ['作曲', song.composer], ['編曲', song.arranger], ['編成', song.voicing], ['伴奏', song.accompaniment], ['演奏時間', song.duration_seconds ? Math.floor(song.duration_seconds / 60) + '分' + String(song.duration_seconds % 60).padStart(2, '0') + '秒' : null], ['難易度', song.difficulty ? stars(song.difficulty) + ' (' + song.difficulty + '/5)' : null], ['出版社', song.publisher]];
      return rows.filter(function (row) { return row[1]; }).map(function (row) { return '<dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd>'; }).join('');
    }
    function openDetail(id) {
      const song = state.songs.find(function (item) { return item.id === id; });
      if (!song) return;
      detailTitle.textContent = song.title;
      detailBody.innerHTML = '<dl class="detail-grid">' + detailRows(song) + '</dl><div class="notice">現在の収録情報には未検証データが含まれます。編成や難易度は楽譜版によって異なる場合があります。</div>';
      if (!detail.open) detail.showModal();
      history.replaceState(null, '', '#song=' + encodeURIComponent(id));
    }
    function closeDetail() { detail.close(); history.replaceState(null, '', location.pathname + location.search); }
    fetch('/api/songs').then(function (response) { if (!response.ok) throw new Error('API error ' + response.status); return response.json(); }).then(function (songs) {
      state.songs = Array.isArray(songs) ? songs : []; total.textContent = state.songs.length + '曲収録';
      Array.from(new Set(state.songs.map(function (song) { return song.voicing; }).filter(Boolean))).sort().forEach(function (value) { const option = document.createElement('option'); option.value = value; option.textContent = value; voicing.appendChild(option); });
      render(); const matched = location.hash.match(/^#song=(.+)$/); if (matched) openDetail(decodeURIComponent(matched[1]));
    }).catch(function (error) { total.textContent = '接続エラー'; status.textContent = 'データの読み込みに失敗しました'; results.innerHTML = '<div class="empty">D1の設定・マイグレーションを確認してください。<br>' + esc(error.message) + '</div>'; });
    [query, voicing, difficulty, sort].forEach(function (element) { element.addEventListener(element === query ? 'input' : 'change', render); });
    document.getElementById('reset').addEventListener('click', function () { query.value = ''; voicing.value = ''; difficulty.value = ''; sort.value = 'kana'; render(); query.focus(); });
    results.addEventListener('click', function (event) { const cardElement = event.target.closest('.card'); if (cardElement) openDetail(cardElement.dataset.id); });
    results.addEventListener('keydown', function (event) { const cardElement = event.target.closest('.card'); if (cardElement && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openDetail(cardElement.dataset.id); } });
    document.getElementById('close').addEventListener('click', closeDetail);
    detail.addEventListener('click', function (event) { if (event.target === detail) closeDetail(); });
    detail.addEventListener('cancel', function (event) { event.preventDefault(); closeDetail(); });
  </script>
</body>
</html>`;

const songSelect = `
  SELECT w.id, w.title, w.title_kana, w.lyricist, w.composer, w.description,
         e.arranger, e.voicing, e.accompaniment, e.duration_seconds,
         e.difficulty, e.publisher, e.source_url, e.verification_status
  FROM works w
  JOIN editions e ON e.work_id = w.id
`;

function json(data: unknown, status = 200): Response { return Response.json(data, { status, headers: { 'cache-control': 'public, max-age=60' } }); }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/' && request.method === 'GET') return new Response(page, { headers: { 'content-type': 'text/html; charset=UTF-8', 'cache-control': 'public, max-age=300' } });
    if (url.pathname === '/api/health' && request.method === 'GET') {
      try { const row = await env.DB.prepare('SELECT COUNT(*) AS songs FROM works WHERE published = 1').first(); return json({ ok: true, songs: Number(row?.songs || 0) }); } catch (error) { return json({ ok: false, error: String(error) }, 500); }
    }
    if (url.pathname === '/api/songs' && request.method === 'GET') {
      try {
        const conditions = ['w.published = 1']; const values: unknown[] = [];
        const search = url.searchParams.get('q')?.trim(); const voice = url.searchParams.get('voicing')?.trim(); const level = Number(url.searchParams.get('difficulty') || 0);
        if (search) { conditions.push('(w.title LIKE ? OR w.title_kana LIKE ? OR w.lyricist LIKE ? OR w.composer LIKE ? OR e.arranger LIKE ?)'); const pattern = '%' + search + '%'; values.push(pattern, pattern, pattern, pattern, pattern); }
        if (voice) { conditions.push('e.voicing = ?'); values.push(voice); }
        if (level >= 1 && level <= 5) { conditions.push('e.difficulty = ?'); values.push(level); }
        const statement = env.DB.prepare(songSelect + ' WHERE ' + conditions.join(' AND ') + ' ORDER BY w.title_kana LIMIT 500');
        const result = values.length ? await statement.bind(...values).all() : await statement.all(); return json(result.results);
      } catch (error) { return json({ error: 'Database query failed', detail: String(error) }, 500); }
    }
    const songMatch = url.pathname.match(/^\/api\/songs\/([A-Za-z0-9_-]+)$/);
    if (songMatch && request.method === 'GET') {
      try { const song = await env.DB.prepare(songSelect + ' WHERE w.published = 1 AND w.id = ? LIMIT 1').bind(songMatch[1]).first(); return song ? json(song) : json({ error: 'Song not found' }, 404); } catch (error) { return json({ error: 'Database query failed', detail: String(error) }, 500); }
    }
    return json({ error: 'Not found' }, 404);
  },
};