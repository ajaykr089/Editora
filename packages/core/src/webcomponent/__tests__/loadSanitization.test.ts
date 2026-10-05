import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

const HOSTILE = '<p>kept</p><img src="x" onerror="window.__pwned = 1"><script>window.__pwned = 2</script>';

async function mount(attrs: Record<string, string> = {}, innerHTML = '', config?: Record<string, unknown>) {
  const el = document.createElement('editora-editor') as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (config) el.jsConfig = config;
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  // connectedCallback -> waitForPluginLoader -> setTimeout(initialize)
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const content = el.querySelector('.editora-content') as HTMLElement | null;
  expect(content, 'editor content element').toBeTruthy();
  return { el, content: content! };
}

describe('<editora-editor> load-time sanitising', () => {
  beforeAll(() => {
    // jsdom has no execCommand; the element only probes it for defaultParagraphSeparator.
    (document as any).execCommand ??= () => false;
    // The standalone bundles set this before the element can initialise; mirror that here.
    (RichTextEditorElement as any).__globalPluginLoader = new PluginLoader();
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    delete (window as any).__pwned;
  });

  it('strips scripts and event handlers from data-initial-content', async () => {
    const { content } = await mount({ 'data-initial-content': HOSTILE });
    expect(content.innerHTML).toContain('kept');
    expect(content.querySelector('script')).toBeNull();
    expect(content.querySelector('[onerror]')).toBeNull();
    expect((window as any).__pwned).toBeUndefined();
  });

  it('strips scripts and event handlers from restored autosave content', async () => {
    localStorage.setItem('xss-autosave', HOSTILE);
    const { content } = await mount({ 'data-initial-content': '<p>original</p>' }, '', {
      autosave: { enabled: true, provider: 'localStorage', storageKey: 'xss-autosave', intervalMs: 600000 },
    });
    expect(content.innerHTML).toContain('kept');
    expect(content.querySelector('script')).toBeNull();
    expect(content.querySelector('[onerror]')).toBeNull();
  });

  it('sanitises content passed to setContent()', async () => {
    const { el, content } = await mount();
    el.setContent(HOSTILE);
    expect(content.innerHTML).toContain('kept');
    expect(content.querySelector('script')).toBeNull();
    expect(content.querySelector('[onerror]')).toBeNull();
  });

  it('keeps ordinary rich content intact', async () => {
    const rich = '<h2 class="t">Title</h2><p>Hello <strong>bold</strong> <a href="https://example.com" target="_blank">link</a></p><ul><li data-type="checklist-item" data-checked="true">todo</li></ul>';
    const { content } = await mount({ 'data-initial-content': rich });
    expect(content.querySelector('h2.t')?.textContent).toBe('Title');
    expect(content.querySelector('a[href="https://example.com"]')).toBeTruthy();
    expect(content.querySelector('li[data-type="checklist-item"][data-checked="true"]')).toBeTruthy();
  });

  it('keeps an editor-inserted embed but strips an unmarked iframe', async () => {
    const html =
      '<p>x</p><iframe data-editora-embed="true" src="https://www.youtube.com/embed/abc" width="560"></iframe>' +
      '<iframe src="https://evil.example/frame"></iframe><iframe data-editora-embed="true" src="javascript:alert(1)"></iframe>';
    const { content } = await mount({ 'data-initial-content': html });
    const frames = Array.from(content.querySelectorAll('iframe'));
    expect(frames).toHaveLength(1);
    expect(frames[0].getAttribute('src')).toBe('https://www.youtube.com/embed/abc');
  });

  it('leaves content untouched when sanitizeOnInput is disabled', async () => {
    const { content } = await mount({ 'data-initial-content': '<p>a</p><mark>b</mark>' }, '', {
      security: { sanitizeOnInput: false },
    });
    expect(content.querySelector('mark')).toBeTruthy();
  });
});

describe('<editora-editor> output omits editing-only chrome', () => {
  const handle = '<div class="resize-handle" style="position: absolute;"></div>';
  const table = `<table><tbody><tr><td style="position: relative;">a${handle}</td></tr></tbody></table>`;

  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    (RichTextEditorElement as any).__globalPluginLoader ??= new PluginLoader();
    if (!customElements.get('editora-editor')) customElements.define('editora-editor', RichTextEditorElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('getContent() and getAPI().getContent() do not include resize handles', async () => {
    const { el, content } = await mount({ 'data-initial-content': '<p>x</p>' });
    content.innerHTML = table; // as if the table plugin had attached its handles
    expect(content.querySelector('.resize-handle')).toBeTruthy();
    expect(el.getContent()).not.toContain('resize-handle');
    expect(el.getContent()).not.toContain('position');
    expect(el.getAPI().getContent()).not.toContain('resize-handle');
  });

  it('content-change events (input and blur) do not include resize handles', async () => {
    const { el, content } = await mount({ 'data-initial-content': '<p>x</p>' });
    const seen: string[] = [];
    el.addEventListener('content-change', (e: Event) => seen.push((e as CustomEvent).detail.html));
    content.innerHTML = table;
    content.dispatchEvent(new Event('input', { bubbles: true }));
    content.dispatchEvent(new Event('blur'));
    await new Promise((r) => setTimeout(r, 250));
    expect(seen.length).toBeGreaterThan(0);
    for (const html of seen) expect(html).not.toContain('resize-handle');
  });
});

describe('<editora-editor> lifecycle', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    (RichTextEditorElement as any).__globalPluginLoader ??= new PluginLoader();
    if (!customElements.get('editora-editor')) customElements.define('editora-editor', RichTextEditorElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const settle = async (el: HTMLElement) => {
    for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) await new Promise((r) => setTimeout(r, 25));
    return el.querySelector('.editora-content') as HTMLElement;
  };

  it('keeps edited content when the element is moved in the DOM', async () => {
    const { el, content } = await mount({ 'data-initial-content': '<p>original</p>' });
    el.setContent('<p>edited by the user</p>');
    expect(content.textContent).toContain('edited by the user');

    const newParent = document.createElement('section');
    document.body.appendChild(newParent);
    newParent.appendChild(el); // disconnect + connect

    const moved = await settle(el);
    expect(moved.textContent).toContain('edited by the user');
    expect(moved.textContent).not.toContain('original');
  });

  it('survives being moved more than once, still holding the latest edit', async () => {
    const { el } = await mount({ 'data-initial-content': '<p>original</p>' });
    el.setContent('<p>first</p>');
    const a = document.createElement('div'); const b = document.createElement('div');
    document.body.append(a, b);
    a.appendChild(el);
    let c = await settle(el);
    expect(c.textContent).toContain('first');
    el.setContent('<p>second</p>');
    b.appendChild(el);
    c = await settle(el);
    expect(c.textContent).toContain('second');
  });

  it('does not carry resize handles through the move', async () => {
    const { el, content } = await mount({ 'data-initial-content': '<p>x</p>' });
    content.innerHTML = '<table><tbody><tr><td style="position: relative;">a<div class="resize-handle"></div></td></tr></tbody></table>';
    const target = document.createElement('div');
    document.body.appendChild(target);
    target.appendChild(el);
    const moved = await settle(el);
    expect(moved.querySelector('.resize-handle')).toBeNull();
    expect(moved.querySelector('td')?.textContent).toBe('a');
  });
});
