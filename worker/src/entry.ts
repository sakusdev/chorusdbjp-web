import app from './index';
import { handleAdmin, type AdminEnv } from './admin';

export interface Env extends AdminEnv {}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const pathname = new URL(request.url).pathname;
    if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/')) {
      return handleAdmin(request, env);
    }
    return app.fetch(request, env);
  },
};
