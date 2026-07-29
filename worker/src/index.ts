export interface Env {
  DB: D1Database;
}

const GITHUB_REPO = 'https://github.com/sakusdev/chorusdbjp-web';

const page = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#ffffff">
<title>ChorusDBJP</title>
<style>
:root{font-family:"Noto Sans JP","Hiragino Sans",system-ui,sans-serif;color:#171717;background:#f5f5f3}*{box-sizing:border-box}body{margin:0}button,input,select{font:inherit}button{cursor:pointer}a{color:inherit}.top{height:60px;background:#fff;border-bottom:1px solid #ddd;display:flex;align-items:center}.top-inner{width:min(1160px,100%);margin:auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between}.brand{font-size:20px;font-weight:850;letter-spacing:-.04em}.brand span{color:#1859d1}.top-links{display:flex;gap:17px;align-items:center;font-size:13px;color:#555}.top-links a{text-decoration:none}.top-links a:hover{text-decoration:underline}.hero{background:#fff;border-bottom:1px solid #ddd}.hero-inner{width:min(1160px,100%);margin:auto;padding:43px 20px 35px}.hero h1{font-size:34px;line-height:1.25;margin:0 0 9px;letter-spacing:-.05em}.hero p{margin:0 0 24px;color:#666}.searchbox{display:flex;max-width:780px;height:54px;border:2px solid #191919;background:#fff}.searchbox input{flex:1;min-width:0;border:0;outline:0;padding:0 16px;font-size:16px}.searchbox button{width:92px;border:0;background:#191919;color:#fff;font-weight:750}.layout{width:min(1160px,100%);margin:auto;padding:28px 20px 64px;display:grid;grid-template-columns:220px 1fr;gap:34px}.filters h2{font-size:13px;margin:0 0 13px;color:#777}.filter{border-top:1px solid #d8d8d8;padding:15px 0}.filter label{display:block;font-size:13px;font-weight:750;margin-bottom:8px}.filter select{width:100%;border:1px solid #aaa;background:#fff;border-radius:0;padding:9px}.reset{border:0;background:none;padding:0;color:#1859d1;font-size:13px}.result-head{display:flex;justify-content:space-between;align-items:center;padding:0 0 12px;border-bottom:2px solid #191919}.result-head strong{font-size:15px}.summary{font-size:12px;color:#777}.list{background:#fff}.row{display:grid;grid-template-columns:minmax(230px,1.8fr) minmax(160px,1fr) 120px 108px 26px;gap:18px;align-items:center;padding:17px 14px;border-bottom:1px solid #e6e6e6;cursor:pointer}.row:hover{background:#f5f7fb}.title-line{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.title{font-size:16px;font-weight:750}.author{font-size:13px;color:#666;line-height:1.55;margin-top:3px}.badge{font-size:12px;color:#444}.verified{font-size:10px;font-weight:750;border:1px solid #8ab19a;color:#20613a;padding:2px 5px}.unverified{font-size:10px;font-weight:750;border:1px solid #c9c9c9;color:#777;padding:2px 5px}.level{font-size:12px;font-weight:700}.level i{display:inline-block;width:7px;height:7px;background:#1859d1;margin-right:3px}.arrow{color:#999;font-size:20px}.empty{padding:52px;text-align:center;color:#777;background:#fff}.warning{margin-bottom:16px;border-left:3px solid #c18120;background:#fff8e9;padding:11px 13px;font-size:12px;color:#694d20;line-height:1.6}dialog{width:min(580px,calc(100% - 28px));border:0;padding:0;box-shadow:0 24px 80px rgba(0,0,0,.3)}dialog::backdrop{background:rgba(0,0,0,.48)}.modal-head{display:flex;justify-content:space-between;align-items:start;padding:24px;border-bottom:1px solid #ddd}.modal-head h2{margin:0;font-size:23px}.close{border:0;background:none;font-size:25px;line-height:1}.modal-body{padding:22px 24px 26px}.detail{display:grid;grid-template-columns:104px 1fr;gap:11px 16px;margin:0}.detail dt{color:#777;font-size:13px}.detail dd{margin:0}.actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:22px}.action{display:inline-block;text-decoration:none;border:1px solid #222;padding:9px 12px;font-size:13px;font-weight:700}.action.primary{background:#191919;color:#fff}.note{margin-top:18px;padding:12px;background:#f2f2f0;font-size:12px;color:#666;line-height:1.65}.footer{border-top:1px solid #ddd;background:#fff}.footer-inner{width:min(1160px,100%);margin:auto;padding:25px 20px 32px;color:#666;font-size:12px;line-height:1.7}.footer a{margin-right:16px}.sort-mobile{display:none}@media(max-width:760px){.top-links a:not(:last-child){display:none}.hero-inner{padding-top:29px}.hero h1{font-size:26px}.layout{display:block;padding:18px 14px 50px}.filters{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px}.filters h2{grid-column:1/-1;margin:0}.filter{border:0;padding:0}.filter:nth-of-type(4){display:none}.reset{grid-column:1/-1;text-align:left}.row{grid-template-columns:1fr auto;padding:16px 12px;gap:8px}.row .author{grid-column:1}.row>.badge,.row>.level{display:none}.row .arrow{grid-column:2;grid-row:1/3}.searchbox button{width:72px}.top-inner{padding:0 14px}.sort-mobile{display:block;border:1px solid #aaa;background:#fff;padding:7px}.summary{display:none}}
</style>
</head>
<body>
<header class="top"><div class="top-inner"><div class="brand">ChorusDB<span>JP</span></div><nav class="top-links"><a href="/api/health">API状態</a><a href="${GITHUB_REPO}" target="_blank" rel="noopener">GitHub</a><span id="total">読み込み中</span></nav></div></header>
<section class="hero"><div class="hero-inner"><h1>歌いたい合唱曲を探す</h1><p>曲名、作詞者、作曲者、編曲者から検索できます。</p><div class="searchbox"><input id="query" type="search" placeholder="例：旅立ちの日に、木下牧子"><button id="searchButton">検索</button></div></div></section>
<main class="layout">
<aside class="filters"><h2>絞り込み</h2><div class="filter"><label for="voicing">編成</label><select id="voicing"><option value="">すべて</option></select></div><div class="filter"><label for="difficulty">難易度</label><select id="difficulty"><option value="">すべて</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div><div class="filter"><label for="verification">確認状態</label><select id="verification"><option value="">すべて</option><option value="verified">確認済みのみ</option><option value="unverified">未確認のみ</option></select></div><div class="filter"><label for="sort">並び順</label><select id="sort"><option value="kana">曲名順</option><option value="difficulty-asc">難易度が低い順</option><option value="difficulty-desc">難易度が高い順</option><option value="composer">作曲者順</option></select></div><button id="reset" class="reset">条件をリセット</button></aside>
<section><div id="warning" class="warning">「未確認」は出版社等の出典確認が完了していない項目です。選曲や楽譜購入の前に必ず公式情報を確認してください。</div><div class="result-head"><strong id="status">読み込み中</strong><span id="summary" class="summary"></span><select id="sortMobile" class="sort-mobile"><option value="kana">曲名順</option><option value="difficulty-asc">難易度↑</option><option value="difficulty-desc">難易度↓</option><option value="composer">作曲者順</option></select></div><div id="results" class="list"></div></section>
</main>
<dialog id="detail"><div class="modal-head"><h2 id="detailTitle"></h2><button id="close" class="close" aria-label="閉じる">×</button></div><div id="detailBody" class="modal-body"></div></dialog>
<footer class="footer"><div class="footer-inner">ChorusDBJPは非公式の楽曲メタデータベースです。歌詞・楽譜・録音物は掲載しません。各作品の権利は権利者に帰属します。<br><a href="${GITHUB_REPO}/issues/new?template=correction.yml" target="_blank" rel="noopener">情報の訂正</a><a href="${GITHUB_REPO}/issues/new?template=rights-removal.yml" target="_blank" rel="noopener">権利者からの削除・修正申請</a><a href="${GITHUB_REPO}/blob/main/docs/PUBLISHING_POLICY.md" target="_blank" rel="noopener">掲載方針</a></div></footer>
<script>
const state={songs:[],stats:null};
const q=document.getElementById('query'),v=document.getElementById('voicing'),d=document.getElementById('difficulty'),verification=document.getElementById('verification'),s=document.getElementById('sort'),sm=document.getElementById('sortMobile'),status=document.getElementById('status'),summary=document.getElementById('summary'),results=document.getElementById('results'),detail=document.getElementById('detail');
function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function dots(n){return Array.from({length:5},(_,i)=>'<i style="opacity:'+(i<n?1:.16)+'"></i>').join('')}
function isVerified(song){return song.verification_status==='verified'}
function row(song){const by=[song.lyricist?'作詞 '+song.lyricist:'',song.composer?'作曲 '+song.composer:''].filter(Boolean).join(' / ');const check=isVerified(song)?'<span class="verified">確認済み</span>':'<span class="unverified">未確認</span>';return '<article class="row" tabindex="0" data-id="'+esc(song.id)+'"><div><div class="title-line"><div class="title">'+esc(song.title)+'</div>'+check+'</div><div class="author">'+esc(by||'作者情報 未確認')+'</div></div><div class="badge">'+esc(song.voicing||'編成未確認')+'</div><div class="badge">'+esc(song.accompaniment||'')+'</div><div class="level">'+dots(Number(song.difficulty||0))+'</div><div class="arrow">›</div></article>'}
function items(){const text=q.value.trim().toLowerCase();const a=state.songs.filter(x=>{const h=[x.title,x.title_kana,x.lyricist,x.composer,x.arranger].join(' ').toLowerCase();const verified=isVerified(x);return(!text||h.includes(text))&&(!v.value||x.voicing===v.value)&&(!d.value||String(x.difficulty)===d.value)&&(!verification.value||(verification.value==='verified'?verified:!verified))});const mode=s.value;if(mode==='difficulty-asc')a.sort((x,y)=>(x.difficulty||99)-(y.difficulty||99));else if(mode==='difficulty-desc')a.sort((x,y)=>(y.difficulty||0)-(x.difficulty||0));else if(mode==='composer')a.sort((x,y)=>String(x.composer||'').localeCompare(String(y.composer||''),'ja'));else a.sort((x,y)=>String(x.title_kana||x.title).localeCompare(String(y.title_kana||y.title),'ja'));return a}
function render(){const a=items();status.textContent=a.length+'曲';results.innerHTML=a.length?a.map(row).join(''):'<div class="empty">該当する曲がありません</div>';const verified=a.filter(isVerified).length;summary.textContent='確認済み '+verified+'曲 / 未確認 '+(a.length-verified)+'曲'}
function openSong(id){const x=state.songs.find(y=>y.id===id);if(!x)return;document.getElementById('detailTitle').textContent=x.title;const data=[['ID',x.id],['読み',x.title_kana],['作詞',x.lyricist],['作曲',x.composer],['編曲',x.arranger],['編成',x.voicing],['伴奏',x.accompaniment],['難易度',x.difficulty?x.difficulty+' / 5':null],['出版社',x.publisher],['確認状態',isVerified(x)?'確認済み':'未確認']].filter(z=>z[1]);const audition='https://www.youtube.com/results?search_query='+encodeURIComponent([x.title,x.composer,'合唱'].filter(Boolean).join(' '));const source=x.source_url?'<a class="action" href="'+esc(x.source_url)+'" target="_blank" rel="noopener">出典を開く ↗</a>':'';const correction='${GITHUB_REPO}/issues/new?template=correction.yml&title='+encodeURIComponent('訂正: '+x.title);document.getElementById('detailBody').innerHTML='<dl class="detail">'+data.map(z=>'<dt>'+esc(z[0])+'</dt><dd>'+esc(z[1])+'</dd>').join('')+'</dl><div class="actions"><a class="action primary" href="'+audition+'" target="_blank" rel="noopener">YouTubeで試聴を探す ↗</a>'+source+'<a class="action" href="'+correction+'" target="_blank" rel="noopener">情報を訂正する ↗</a></div><div class="note">試聴リンクはYouTube検索結果を開きます。公式動画・正規配信かを確認してください。未確認項目や楽譜版による差異が含まれる場合があります。</div>';detail.showModal();history.replaceState(null,'','#song='+encodeURIComponent(id))}
async function load(){const [songsResponse,statsResponse]=await Promise.all([fetch('/api/songs'),fetch('/api/stats')]);if(!songsResponse.ok)throw new Error('songs API failed');const songs=await songsResponse.json();state.songs=Array.isArray(songs)?songs:[];if(statsResponse.ok)state.stats=await statsResponse.json();document.getElementById('total').textContent=state.songs.length+'曲収録';[...new Set(state.songs.map(x=>x.voicing).filter(Boolean))].sort().forEach(x=>{const o=document.createElement('option');o.value=o.textContent=x;v.appendChild(o)});render();const m=location.hash.match(/^#song=(.+)$/);if(m)openSong(decodeURIComponent(m[1]))}
[q,v,d,verification,s].forEach(e=>e.addEventListener(e===q?'input':'change',()=>{sm.value=s.value;render()}));sm.addEventListener('change',()=>{s.value=sm.value;render()});document.getElementById('searchButton').onclick=render;document.getElementById('reset').onclick=()=>{q.value=v.value=d.value=verification.value='';s.value=sm.value='kana';render()};results.addEventListener('click',e=>{const r=e.target.closest('.row');if(r)openSong(r.dataset.id)});results.addEventListener('keydown',e=>{const r=e.target.closest('.row');if(r&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openSong(r.dataset.id)}});document.getElementById('close').onclick=()=>{detail.close();history.replaceState(null,'',location.pathname)};detail.addEventListener('click',e=>{if(e.target===detail)detail.close()});load().catch(error=>{status.textContent='読み込みに失敗しました';results.innerHTML='<div class="empty">'+esc(error.message)+'</div>'});
</script></body></html>`;

const songSelect = `
SELECT w.id,w.title,w.title_kana,w.lyricist,w.composer,w.description,
       e.arranger,e.voicing,e.accompaniment,e.duration_seconds,e.difficulty,
       e.publisher,e.source_url,e.verification_status
FROM works w
JOIN editions e ON e.work_id=w.id`;

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      'cache-control': status === 200 ? 'public, max-age=60' : 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(page, {
        headers: {
          'content-type': 'text/html; charset=UTF-8',
          'cache-control': 'public, max-age=120',
          'content-security-policy': "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'",
          'referrer-policy': 'strict-origin-when-cross-origin',
          'x-content-type-options': 'nosniff',
        },
      });
    }

    if (url.pathname === '/api/health' && request.method === 'GET') {
      try {
        await env.DB.prepare('SELECT 1').first();
        return json({ ok: true, service: 'chorusdbjp-api' });
      } catch (error) {
        return json({ ok: false, error: String(error) }, 500);
      }
    }

    if (url.pathname === '/api/stats' && request.method === 'GET') {
      try {
        const row = await env.DB.prepare(`
          SELECT
            COUNT(DISTINCT w.id) AS total,
            COUNT(DISTINCT CASE WHEN e.verification_status='verified' THEN w.id END) AS verified,
            COUNT(DISTINCT CASE WHEN e.verification_status!='verified' THEN w.id END) AS unverified
          FROM works w
          JOIN editions e ON e.work_id=w.id
          WHERE w.published=1
        `).first();
        return json({
          total: Number(row?.total || 0),
          verified: Number(row?.verified || 0),
          unverified: Number(row?.unverified || 0),
        });
      } catch (error) {
        return json({ error: 'Database query failed', detail: String(error) }, 500);
      }
    }

    if (url.pathname === '/api/songs' && request.method === 'GET') {
      try {
        const conditions = ['w.published=1'];
        const values: unknown[] = [];
        const search = url.searchParams.get('q')?.trim();
        const voicing = url.searchParams.get('voicing')?.trim();
        const verification = url.searchParams.get('verification')?.trim();
        const difficulty = Number(url.searchParams.get('difficulty') || 0);

        if (search) {
          const pattern = '%' + search + '%';
          conditions.push('(w.title LIKE ? OR w.title_kana LIKE ? OR w.lyricist LIKE ? OR w.composer LIKE ? OR e.arranger LIKE ?)');
          values.push(pattern, pattern, pattern, pattern, pattern);
        }
        if (voicing) {
          conditions.push('e.voicing=?');
          values.push(voicing);
        }
        if (difficulty >= 1 && difficulty <= 5) {
          conditions.push('e.difficulty=?');
          values.push(difficulty);
        }
        if (verification === 'verified') {
          conditions.push("e.verification_status='verified'");
        } else if (verification === 'unverified') {
          conditions.push("e.verification_status!='verified'");
        }

        const statement = env.DB.prepare(songSelect + ' WHERE ' + conditions.join(' AND ') + ' ORDER BY w.title_kana LIMIT 500');
        const result = values.length ? await statement.bind(...values).all() : await statement.all();
        return json(result.results);
      } catch (error) {
        return json({ error: 'Database query failed', detail: String(error) }, 500);
      }
    }

    const match = url.pathname.match(/^\/api\/songs\/([^/]+)$/);
    if (match && request.method === 'GET') {
      try {
        const song = await env.DB.prepare(songSelect + ' WHERE w.published=1 AND w.id=? LIMIT 1')
          .bind(decodeURIComponent(match[1]))
          .first();
        return song ? json(song) : json({ error: 'Song not found' }, 404);
      } catch (error) {
        return json({ error: 'Database query failed', detail: String(error) }, 500);
      }
    }

    return json({ error: 'Not found' }, 404);
  },
};
