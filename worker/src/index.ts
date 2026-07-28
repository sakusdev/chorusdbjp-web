export interface Env { DB: D1Database }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/songs' && request.method === 'GET') {
      const result = await env.DB.prepare(`
        SELECT w.id, w.title, w.title_kana, w.lyricist, w.composer,
               e.voicing, e.accompaniment, e.duration_seconds, e.difficulty
        FROM works w
        JOIN editions e ON e.work_id = w.id
        WHERE w.published = 1
        ORDER BY w.title_kana
      `).all();
      return Response.json(result.results);
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  }
};
