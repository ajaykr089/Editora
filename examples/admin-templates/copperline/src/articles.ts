import { $, esc } from './common';
import '@editora/ui-core/data-table';
import '@editora/ui-core/tabs';
import { ARTICLE_TONE, listArticles, shortDate } from '../../shared/data';

const LABEL = { published: 'Published', draft: 'Draft', review: 'In review' } as const;
const table = $('#articles');
const tabs = $('#article-tabs');

async function load(status: string) {
  table.setAttribute('state', 'loading');
  const rows = await listArticles('', status);
  table.querySelector('tbody')!.innerHTML = rows.map((a) => `
    <tr data-id="${a.id}" data-href="./editor.html?id=${a.id}">
      <td><a class="cl-strong" href="./editor.html?id=${a.id}">${esc(a.title)}</a><span class="cl-sub">/help/${esc(a.slug)}</span></td>
      <td>${esc(a.category)}</td>
      <td data-value="${a.updated}">${shortDate(a.updated)}</td>
      <td data-align="end" data-value="${a.views}">${a.views.toLocaleString('en-US')}</td>
      <td><ui-badge tone="${ARTICLE_TONE[a.status]}" variant="soft" size="sm">${LABEL[a.status]}</ui-badge></td>
    </tr>`).join('');
  table.setAttribute('state', 'idle');
}

// ui-tabs reports the selected index; each tab carries its status in data-value.
tabs.addEventListener('change', (event) => {
  const index = (event as CustomEvent).detail?.index ?? 0;
  const tab = tabs.querySelectorAll<HTMLElement>('[slot="tab"]')[index];
  void load(tab?.dataset.value || '');
});
$('#new-article').addEventListener('click', () => { location.href = './editor.html'; });
void load('');
