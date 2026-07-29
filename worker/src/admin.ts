import { createRemoteJWKSet, jwtVerify } from 'jose';

export interface AdminEnv {
  DB: D1Database;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
}

const adminPage = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ChorusDBJP Admin</title>
<style>
:root{font-family:"Noto Sans JP","Hiragino Sans",system-ui,sans-serif;color:#171717;background:#f4f4f2}*{box-sizing:border-box}body{margin:0}button,input,select,textarea{font:inherit}.bar{height:60px;background:#171717;color:#fff;display:flex;align-items:center}.bar-inner{width:min(1200px,100%);margin:auto;padding:0 18px;display:flex;justify-content:space-between;align-items:center}.brand{font-weight:800}.user{font-size:12px;color:#ccc}.layout{width:min(1200px,100%);margin:auto;padding:24px 18px 60px;display:grid;grid-template-columns:1fr 420px;gap:24px}.panel{background:#fff;border:1px solid #ddd}.head{padding:16px;border-bottom:1px solid #ddd;display:flex;gap:10px;align-items:center;justify-content:space-between}.head h1,.head h2{font-size:17px;margin:0}.search{width:280px;border:1px solid #aaa;padding:9px}.list{max-height:calc(100vh - 150px);overflow:auto}.row{display:grid;grid-template-columns:1fr 100px 90px;gap:10px;padding:13px 15px;border-bottom:1px solid #eee;cursor:pointer}.row:hover{background:#f5f7fb}.title{font-weight:700}.meta{font-size:12px;color:#666;margin-top:3px}.status{font-size:11px}.form{padding:17px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.field{margin-bottom:12px}.field.full{grid-column:1/-1}.field label{display:block;font-size:12px;font-weight:700;margin-bottom:5px}.field input,.field select,.field textarea{width:100%;border:1px solid #aaa;padding:9px;background:#fff}.field textarea{min-height:74px;resize:vertical}.actions{display:flex;gap:9px;padding-top:8px}.btn{border:1px solid #222;background:#fff;padding:10px 14px;font-weight:700;cursor:pointer}.btn.primary{background:#171717;color:#fff}.btn.danger{border-color:#9b2929;color:#9b2929}.notice{font-size:12px;min-height:18px;margin-top:12px}.empty{padding:30px;color:#777;text-align:center}@media(max-width:850px){.layout{display:block}.panel{margin-bottom:18px}.list{max-height:48vh}.grid{display:block}.search{width:170px}}
</style></head><body>
<header class="bar"><div class="bar-inner"><div class="brand">ChorusDBJP Admin</div><div id="user" class="user">認証確認中</div></div></header>
<main class="layout"><section class="panel"><div class="head"><h1>楽曲</h1><input id="search" class="search" type="search" placeholder="曲名・作者・ID"></div><div id="list" class="list"></div></section>
<section class="panel"><div class="head"><h2 id="formTitle">新規登録</h2><button id="new" class="btn">新規</button></div><form id="form" class="form"><div class="grid">
<div class="field"><label>ID</label><input name="id" required pattern="[A-Za-z0-9_-]+"></div><div class="field"><label>公開状態</label><select name="published"><option value="1">公開</option><option value="0">非公開</option></select></div>
<div class="field full"><label>曲名</label><input name="title" required></div><div class="field full"><label>読み</label><input name="title_kana" required></div>
<div class="field"><label>作詞</label><input name="lyricist"></div><div class="field"><label>作曲</label><input name="composer" required></div>
<div class="field"><label>編曲</label><input name="arranger"></div><div class="field"><label>作品種別</label><select name="work_type"><option value="song">単独曲</option><option value="arrangement">編曲作品</option><option value="suite">組曲</option><option value="collection">曲集</option></select></div>
<div class="field"><label>編成</label><input name="voicing" required></div><div class="field"><label>伴奏</label><input name="accompaniment" required value="ピアノ"></div>
<div class="field"><label>難易度</label><select name="difficulty"><option value="">未設定</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div><div class="field"><label>確認状態</label><select name="verification_status"><option value="unverified">未確認</option><option value="verified">確認済み</option></select></div>
<div class="field full"><label>出版社</label><input name="publisher"></div><div class="field full"><label>出典URL</label><input name="source_url" type="url"></div>
<div class="field"><label>出典確認日</label><input name="source_checked_at" type="date"></div><div class="field full"><label>確認メモ</label><textarea name="verification_notes"></textarea></div>
</div><div class="actions"><button class="btn primary" type="submit">保存</button><button id="unpublish" class="btn danger" type="button">公開停止</button></div><div id="notice" class="notice"></div></form></section></main>
<script>
const state={songs:[],selected:null};const list=document.getElementById('list'),form=document.getElementById('form'),notice=document.getElementById('notice'),search=document.getElementById('search');
function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function api(url,options={}){const r=await fetch(url,{...options,headers:{'content-type':'application/json',...(options.headers||{})}});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||('HTTP '+r.status));return data}
function render(){const q=search.value.trim().toLowerCase();const rows=state.songs.filter(x=>[x.id,x.title,x.lyricist,x.composer].join(' ').toLowerCase().includes(q));list.innerHTML=rows.length?rows.map(x=>'<div class="row" data-id="'+esc(x.id)+'"><div><div class="title">'+esc(x.title)+'</div><div class="meta">'+esc([x.lyricist,x.composer].filter(Boolean).join(' / ')||'作者未確認')+'</div></div><div class="status">'+(x.verification_status==='verified'?'確認済み':'未確認')+'</div><div class="status">'+(Number(x.published)?'公開':'非公開')+'</div></div>').join(''):'<div class="empty">該当なし</div>'}
function fill(x){state.selected=x?.id||null;document.getElementById('formTitle').textContent=x?'編集':'新規登録';for(const e of form.elements){if(!e.name)continue;e.value=x?.[e.name]??(e.name==='published'?'1':e.name==='work_type'?'song':e.name==='accompaniment'?'ピアノ':e.name==='verification_status'?'unverified':'')}form.elements.id.readOnly=!!x;notice.textContent=''}
async function load(){const session=await api('/api/admin/session');document.getElementById('user').textContent=session.email;state.songs=await api('/api/admin/songs');render();fill(null)}
list.onclick=e=>{const row=e.target.closest('.row');if(row)fill(state.songs.find(x=>x.id===row.dataset.id))};search.oninput=render;document.getElementById('new').onclick=()=>fill(null);
form.onsubmit=async e=>{e.preventDefault();notice.textContent='保存中…';const body=Object.fromEntries(new FormData(form));body.difficulty=body.difficulty?Number(body.difficulty):null;body.published=Number(body.published);const method=state.selected?'PUT':'POST';const url=state.selected?'/api/admin/songs/'+encodeURIComponent(state.selected):'/api/admin/songs';try{await api(url,{method,body:JSON.stringify(body)});notice.textContent='保存しました';state.songs=await api('/api/admin/songs');render();fill(state.songs.find(x=>x.id===body.id))}catch(err){notice.textContent='エラー: '+err.message}};
document.getElementById('unpublish').onclick=async()=>{if(!state.selected)return;if(!confirm('この曲を非公開にしますか？'))return;try{await api('/api/admin/songs/'+encodeURIComponent(state.selected),{method:'DELETE'});state.songs=await api('/api/admin/songs');render();fill(state.songs.find(x=>x.id===state.selected));notice.textContent='非公開にしました'}catch(err){notice.textContent='エラー: '+err.message}};load().catch(err=>{list.innerHTML='<div class="empty">'+esc(err.message)+'</div>'});
</script></body></html>`;

function normalizeTeamDomain(value: string): string {
  return value.startsWith('http') ? value.replace(/\/$/, '') : `https://${value.replace(/\/$/, '')}`;
}

async function authenticate(request: Request, env: AdminEnv): Promise<string> {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) throw new Error('Access environment variables are not configured');
  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) throw new Error('Cloudflare Access token is missing');
  const teamDomain = normalizeTeamDomain(env.ACCESS_TEAM_DOMAIN);
  const jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
  const { payload } = await jwtVerify(token, jwks, { issuer: teamDomain, audience: env.ACCESS_AUD });
  const email = String(payload.email || '').toLowerCase();
  if (!email) throw new Error('Authenticated email is missing');
  const allowed = (env.ADMIN_EMAILS || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (allowed.length && !allowed.includes(email)) throw new Error('This account is not an administrator');
  return email;
}

function response(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
}

const adminSelect = `SELECT w.id,w.title,w.title_kana,w.lyricist,w.composer,w.description,w.published,w.work_type,e.id AS edition_id,e.arranger,e.voicing,e.accompaniment,e.duration_seconds,e.difficulty,e.publisher,e.source_url,e.verification_status,e.source_checked_at,e.verification_notes FROM works w LEFT JOIN editions e ON e.work_id=w.id`;

export async function handleAdmin(request: Request, env: AdminEnv): Promise<Response> {
  let email: string;
  try { email = await authenticate(request, env); }
  catch (error) { return response({ error: String(error instanceof Error ? error.message : error) }, 403); }

  const url = new URL(request.url);
  if (url.pathname === '/admin' || url.pathname === '/admin/') {
    return new Response(adminPage, { headers: { 'content-type': 'text/html; charset=UTF-8', 'cache-control': 'no-store', 'content-security-policy': "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'" } });
  }
  if (url.pathname === '/api/admin/session' && request.method === 'GET') return response({ email });
  if (url.pathname === '/api/admin/songs' && request.method === 'GET') {
    const result = await env.DB.prepare(`${adminSelect} ORDER BY w.updated_at DESC,w.title_kana LIMIT 1000`).all();
    return response(result.results);
  }
  if (url.pathname === '/api/admin/songs' && request.method === 'POST') {
    const body = await request.json<Record<string, unknown>>();
    const id = String(body.id || '').trim();
    if (!/^[A-Za-z0-9_-]+$/.test(id)) return response({ error: 'IDは英数字・ハイフン・アンダースコアのみです' }, 400);
    await env.DB.batch([
      env.DB.prepare('INSERT INTO works (id,title,title_kana,lyricist,composer,description,published,work_type) VALUES (?,?,?,?,?,?,?,?)').bind(id, body.title, body.title_kana, body.lyricist || null, body.composer, body.description || null, Number(body.published ?? 0), body.work_type || 'song'),
      env.DB.prepare('INSERT INTO editions (work_id,arranger,voicing,accompaniment,difficulty,publisher,source_url,verification_status,source_checked_at,verification_notes) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id, body.arranger || null, body.voicing, body.accompaniment, body.difficulty || null, body.publisher || null, body.source_url || null, body.verification_status || 'unverified', body.source_checked_at || null, body.verification_notes || null),
    ]);
    return response({ ok: true, id }, 201);
  }
  const match = url.pathname.match(/^\/api\/admin\/songs\/([^/]+)$/);
  if (match && request.method === 'PUT') {
    const id = decodeURIComponent(match[1]);
    const body = await request.json<Record<string, unknown>>();
    await env.DB.batch([
      env.DB.prepare('UPDATE works SET title=?,title_kana=?,lyricist=?,composer=?,description=?,published=?,work_type=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(body.title, body.title_kana, body.lyricist || null, body.composer, body.description || null, Number(body.published ?? 0), body.work_type || 'song', id),
      env.DB.prepare('UPDATE editions SET arranger=?,voicing=?,accompaniment=?,difficulty=?,publisher=?,source_url=?,verification_status=?,source_checked_at=?,verification_notes=? WHERE work_id=?').bind(body.arranger || null, body.voicing, body.accompaniment, body.difficulty || null, body.publisher || null, body.source_url || null, body.verification_status || 'unverified', body.source_checked_at || null, body.verification_notes || null, id),
    ]);
    return response({ ok: true, id });
  }
  if (match && request.method === 'DELETE') {
    const id = decodeURIComponent(match[1]);
    await env.DB.prepare('UPDATE works SET published=0,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(id).run();
    return response({ ok: true, id, published: 0 });
  }
  return response({ error: 'Not found' }, 404);
}
