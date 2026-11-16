import { $, param, toast } from './common';
import '@editora/ui-core/breadcrumb';
import '@editora/ui-core/input';
import '@editora/ui-core/select';
import '@editora/ui-core/switch';
// The rich-text editor as a web component: this import defines <editora-editor> and loads each
// plugin named in its plugins attribute on demand.
import '@editora/core/webcomponent';
import { getArticle, saveArticle } from '../../shared/data';

type EditorElement = HTMLElement & { getContent(): string; setContent(html: string): void };

const id = param('id');
const editor = $<EditorElement>('#body');
const title = $<HTMLInputElement>('#title');
const slug = $<HTMLInputElement>('#slug');
const category = $<HTMLSelectElement>('#category');
let dirty = false;

const words = (html: string) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const showCount = (html: string) => { $('#count').textContent = `${words(html)} words`; };

// The editor fires editor-ready once it is built; set the content after that.
const ready = new Promise<void>((resolve) => editor.addEventListener('editor-ready', () => resolve(), { once: true }));

if (id) {
  const article = await getArticle(id);
  if (article) {
    document.title = `${article.title} · Copperline`;
    $('#heading').textContent = 'Edit article';
    $('#crumb').textContent = article.title;
    $('#status-line').textContent = article.status === 'published' ? 'Published' : article.status === 'review' ? 'In review' : 'Draft';
    title.value = article.title;
    slug.value = article.slug;
    category.value = article.category;
    $('#publish').textContent = article.status === 'published' ? 'Update' : 'Publish';
    await ready;
    editor.setContent(article.html);
    showCount(article.html);
  }
}

editor.addEventListener('content-change', (event) => {
  dirty = true;
  showCount((event as CustomEvent<{ html: string }>).detail.html);
});
window.addEventListener('beforeunload', (event) => { if (dirty) event.preventDefault(); });

async function save(status: 'draft' | 'published') {
  const result = await saveArticle({ id: id || undefined, title: title.value, slug: slug.value, category: category.value, html: editor.getContent(), status });
  // Show the server's field errors on the fields themselves.
  title.toggleAttribute('data-error', false);
  slug.toggleAttribute('data-error', false);
  $('#body-error').textContent = '';
  if (!result.ok) {
    if (result.errors.title) { title.setAttribute('data-error', result.errors.title); title.setAttribute('validation', 'error'); }
    if (result.errors.slug) { slug.setAttribute('data-error', result.errors.slug); slug.setAttribute('validation', 'error'); }
    if (result.errors.html) $('#body-error').textContent = result.errors.html;
    void toast('Not saved: check the highlighted fields.', 'error');
    return;
  }
  title.removeAttribute('validation');
  slug.removeAttribute('validation');
  dirty = false;
  void toast(status === 'published' ? 'Published' : 'Draft saved');
  if (!id) location.href = `./editor.html?id=${result.article.id}`;
}

$('#save-draft').addEventListener('click', () => save('draft'));
$('#publish').addEventListener('click', () => save('published'));
