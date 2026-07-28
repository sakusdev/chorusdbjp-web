import app from './index';

export interface Env {
  DB: D1Database;
}

const previewStyles = `
<style>
.preview-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #dedede;
}
.preview-link {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 0 15px;
  background: #171717;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
}
.preview-link:hover,
.preview-link:focus-visible {
  background: #333;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.preview-note {
  width: 100%;
  margin: 0;
  color: #777;
  font-size: 11px;
  line-height: 1.55;
}
</style>`;

const previewScript = `
<script>
(() => {
  const body = document.getElementById('detailBody');
  const title = document.getElementById('detailTitle');
  if (!body || !title) return;

  function readDetail(label) {
    const terms = body.querySelectorAll('.detail dt');
    for (const term of terms) {
      if (term.textContent.trim() === label) {
        return term.nextElementSibling?.textContent?.trim() || '';
      }
    }
    return '';
  }

  function addPreviewAnchor() {
    if (!title.textContent.trim() || body.querySelector('.preview-actions')) return;

    const composer = readDetail('作曲');
    const query = [title.textContent.trim(), composer, '合唱'].filter(Boolean).join(' ');
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);

    const actions = document.createElement('div');
    actions.className = 'preview-actions';

    const link = document.createElement('a');
    link.className = 'preview-link';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'YouTubeで試聴を探す ↗';
    link.setAttribute('aria-label', title.textContent.trim() + 'の試聴をYouTubeで探す');

    const note = document.createElement('p');
    note.className = 'preview-note';
    note.textContent = '外部サイトの検索結果を開きます。演奏・編曲版が登録内容と異なる場合があります。';

    actions.append(link, note);
    body.append(actions);
  }

  new MutationObserver(addPreviewAnchor).observe(body, {
    childList: true,
    subtree: true
  });
  addPreviewAnchor();
})();
</script>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await app.fetch(request, env);
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.pathname !== '/') {
      return response;
    }

    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) {
      return response;
    }

    return new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append(previewStyles, { html: true });
        },
      })
      .on('body', {
        element(element) {
          element.append(previewScript, { html: true });
        },
      })
      .transform(response);
  },
};
