import { readFileSync } from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ToastManager } from '../src/core/ToastManager';
import { isSafeUrl, setSafeHtml } from '../src/core/safeHtml';

let manager: ToastManager;

beforeEach(() => {
  document.body.innerHTML = '';
  manager = new ToastManager();
  (window as any).__pwned = 0;
});

afterEach(() => {
  manager.destroy();
});

const toasts = () => Array.from(document.querySelectorAll<HTMLElement>('.editora-toast'));
const messageOf = (el: Element) => el.querySelector('.editora-toast-message') as HTMLElement;
const waitForToasts = (n: number) => vi.waitFor(() => expect(toasts().length).toBe(n));

describe('close button', () => {
  it('is off by default', async () => {
    manager.show({ message: 'plain', duration: 0 });
    await waitForToasts(1);
    expect(toasts()[0].querySelector('.editora-toast-close')).toBeNull();
  });

  it('is shown for closable: true and for its alias closeButton: true', async () => {
    manager.show({ message: 'a', duration: 0, closable: true });
    manager.show({ message: 'b', duration: 0, closeButton: true });
    await waitForToasts(2);
    for (const el of toasts()) {
      const close = el.querySelector('.editora-toast-close') as HTMLButtonElement;
      expect(close, el.textContent || '').not.toBeNull();
      expect(close.getAttribute('aria-label')).toBe('Close notification');
      expect(close.getAttribute('type')).toBe('button');
    }
  });

  it('lets an explicit option beat the configured default, in both directions', async () => {
    manager.configure({ closeButton: true });
    manager.show({ message: 'opt out', duration: 0, closable: false });
    manager.show({ message: 'inherits', duration: 0 });
    await waitForToasts(2);
    const byText = (t: string) => toasts().find((el) => el.textContent?.includes(t))!;
    expect(byText('opt out').querySelector('.editora-toast-close')).toBeNull();
    expect(byText('inherits').querySelector('.editora-toast-close')).not.toBeNull();
  });

  it('dismisses the toast when clicked', async () => {
    manager.show({ message: 'bye', duration: 0, closable: true });
    await waitForToasts(1);
    (toasts()[0].querySelector('.editora-toast-close') as HTMLButtonElement).click();
    await vi.waitFor(() => expect(toasts().length).toBe(0), { timeout: 3000 });
  });

  it('is added and removed by update()', async () => {
    const toast = manager.show({ message: 'upd', duration: 0 });
    await waitForToasts(1);
    manager.update(toast.id, { closable: true });
    await vi.waitFor(() => expect(toasts()[0].querySelector('.editora-toast-close')).not.toBeNull());
    manager.update(toast.id, { closable: false });
    await vi.waitFor(() => expect(toasts()[0].querySelector('.editora-toast-close')).toBeNull());
  });

  it('is visible on touch devices (no hover to reveal it)', () => {
    const css = readFileSync(join(__dirname, '..', 'src', 'toast.css'), 'utf8');
    const block = css.match(/@media \(hover: none\)\s*\{([\s\S]*?)\n\}/);
    expect(block, 'a (hover: none) rule').not.toBeNull();
    expect(block![1]).toMatch(/\.editora-toast-close/);
    expect(block![1]).toMatch(/opacity:\s*1/);
  });
});

describe('html: true', () => {
  it('renders formatting and safe links', async () => {
    manager.show({ message: 'Saved <b>3</b> files, <em>see</em> <a href="https://example.com/x">report</a>', html: true, duration: 0 });
    await waitForToasts(1);
    const message = messageOf(toasts()[0]);
    expect(message.querySelector('b')?.textContent).toBe('3');
    expect(message.querySelector('em')?.textContent).toBe('see');
    const link = message.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('https://example.com/x');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('still shows the literal text when html is not set', async () => {
    manager.show({ message: '<b>not bold</b>', duration: 0 });
    await waitForToasts(1);
    const message = messageOf(toasts()[0]);
    expect(message.textContent).toBe('<b>not bold</b>');
    expect(message.querySelector('b')).toBeNull();
  });

  it('is applied when a toast is updated', async () => {
    const toast = manager.show({ message: 'first', html: true, duration: 0 });
    await waitForToasts(1);
    manager.update(toast.id, { message: 'now <strong>bold</strong>' });
    await vi.waitFor(() => expect(messageOf(toasts()[0]).querySelector('strong')).not.toBeNull());
  });
});

describe('safe html rendering', () => {
  const render = (html: string) => {
    const host = document.createElement('div');
    setSafeHtml(host, html);
    return host;
  };

  const attacks: Array<[string, string]> = [
    ['script element', 'a<script>window.__pwned=1</script>b'],
    ['img onerror', '<img src=x onerror="window.__pwned=1">'],
    ['svg onload', '<svg onload="window.__pwned=1"><circle/></svg>'],
    ['iframe srcdoc', '<iframe srcdoc="<script>parent.__pwned=1</script>"></iframe>'],
    ['javascript: link', '<a href="javascript:window.__pwned=1">x</a>'],
    ['javascript: leading whitespace', '<a href=" \tjavascript:window.__pwned=1">x</a>'],
    ['javascript: mixed case', '<a href="JaVaScRiPt:window.__pwned=1">x</a>'],
    ['javascript: embedded newline', '<a href="java\nscript:window.__pwned=1">x</a>'],
    ['data: link', '<a href="data:text/html,<script>1</script>">x</a>'],
    ['vbscript: link', '<a href="vbscript:msgbox(1)">x</a>'],
    ['event handler on allowed tag', '<b onclick="window.__pwned=1" onmouseover="window.__pwned=1">x</b>'],
    ['style attribute / element', '<span style="background:url(javascript:1)">x</span><style>body{display:none}</style>'],
    ['form and input', '<form action="javascript:1"><input name=a><button>go</button></form>'],
    ['mutation xss (noscript)', '<noscript><p title="</noscript><img src=x onerror=window.__pwned=1>"></noscript>'],
    ['math / svg namespace confusion', '<math><mtext><table><mglyph><style><img src=x onerror=window.__pwned=1>'],
    ['base and meta', '<base href="https://evil.example/"><meta http-equiv="refresh" content="0;url=javascript:1">'],
  ];

  for (const [name, payload] of attacks) {
    it(`neutralises: ${name}`, () => {
      const host = render(payload);
      expect(host.querySelector('script, iframe, img, svg, form, input, button, style, base, meta, math, object, embed')).toBeNull();
      for (const el of host.querySelectorAll('*')) {
        expect([...el.attributes].map((a) => a.name).filter((a) => /^on/i.test(a) || a === 'style' || a === 'srcdoc')).toEqual([]);
        const href = el.getAttribute('href');
        if (href !== null) expect(isSafeUrl(href), href).toBe(true);
      }
      expect((window as any).__pwned).toBe(0);
    });
  }

  it('keeps the text of unknown elements and drops the content of dangerous ones', () => {
    expect(render('<div><section>kept</section></div>').textContent).toBe('kept');
    expect(render('x<script>hidden</script>y').textContent).toBe('xy');
  });

  it('keeps lists, line breaks and inline formatting', () => {
    const host = render('<ul><li>one</li><li>two<br>lines</li></ul><p><code>x</code> <kbd>Ctrl</kbd></p>');
    expect(host.querySelectorAll('li').length).toBe(2);
    expect(host.querySelector('br')).not.toBeNull();
    expect(host.querySelector('code')?.textContent).toBe('x');
  });

  it('replaces existing content', () => {
    const host = document.createElement('div');
    host.textContent = 'old';
    setSafeHtml(host, '<b>new</b>');
    expect(host.textContent).toBe('new');
  });

  it('isSafeUrl accepts http(s), mailto, tel and relative links only', () => {
    for (const ok of ['https://a.b/c?d=1#e', 'http://a.b', 'mailto:a@b.c', 'tel:+123', '/path', './rel', '../up', '#frag', '?q=1', '//cdn.example/x', 'page.html']) expect(isSafeUrl(ok), ok).toBe(true);
    for (const bad of ['javascript:alert(1)', ' JAVASCRIPT:alert(1)', 'java\tscript:1', 'data:text/html,x', 'vbscript:1', 'file:///etc/passwd', '', '   ']) expect(isSafeUrl(bad), JSON.stringify(bad)).toBe(false);
  });
});

describe('content is rendered as text by default', () => {
  it('never turns title, message, description, icon, action labels or custom ids into markup', async () => {
    manager.show({
      id: 'x" onmouseover="window.__pwned=1',
      className: 'ok" onclick="window.__pwned=2',
      title: '<img src=x onerror="window.__pwned=3">',
      message: '<img src=x onerror="window.__pwned=4">',
      description: '<img src=x onerror="window.__pwned=5">',
      icon: '<img src=x onerror="window.__pwned=6">',
      actions: [{ label: '<img src=x onerror="window.__pwned=7">', onClick: () => {} }],
      theme: 'x" onfocus="window.__pwned=8' as any,
      duration: 0,
    });
    await waitForToasts(1);
    const el = toasts()[0];
    expect(el.querySelector('img')).toBeNull();
    expect([el, ...el.querySelectorAll('*')].some((n) => [...n.attributes].some((a) => /^on/i.test(a.name)))).toBe(false);
    expect((window as any).__pwned).toBe(0);
  });
});

describe('accessibility', () => {
  it('uses role=alert / assertive for errors and role=status / polite otherwise, in a labelled live region', async () => {
    manager.show({ message: 'bad', level: 'error', duration: 0 });
    manager.show({ message: 'fine', level: 'success', duration: 0 });
    await waitForToasts(2);
    const err = toasts().find((t) => t.textContent?.includes('bad'))!;
    const ok = toasts().find((t) => t.textContent?.includes('fine'))!;
    expect([err.getAttribute('role'), err.getAttribute('aria-live')]).toEqual(['alert', 'assertive']);
    expect([ok.getAttribute('role'), ok.getAttribute('aria-live')]).toEqual(['status', 'polite']);
    const region = document.querySelector('.editora-toast-container')!;
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-label')).toBe('Toast notifications');
  });
});

describe('lifecycle', () => {
  it('queues toasts beyond maxVisible and shows the next one when a visible toast is dismissed', async () => {
    manager.configure({ maxVisible: 2 });
    const first = manager.show({ message: 'n1', duration: 0 });
    manager.show({ message: 'n2', duration: 0 });
    manager.show({ message: 'n3', duration: 0 });
    await waitForToasts(2);
    expect(toasts().map((t) => t.textContent)).toEqual(expect.arrayContaining([expect.stringContaining('n1'), expect.stringContaining('n2')]));
    manager.dismiss(first.id);
    await vi.waitFor(() => expect(toasts().some((t) => t.textContent?.includes('n3'))).toBe(true), { timeout: 3000 });
  });

  it('auto-dismisses after its duration', async () => {
    manager.show({ message: 'short', duration: 150 });
    await waitForToasts(1);
    await vi.waitFor(() => expect(toasts().length).toBe(0), { timeout: 3000 });
  });

  it('update() changes the message and level', async () => {
    const toast = manager.show({ message: 'working', level: 'loading', duration: 0 });
    await waitForToasts(1);
    manager.update(toast.id, { message: 'done', level: 'success' });
    await vi.waitFor(() => expect(messageOf(toasts()[0]).textContent).toBe('done'));
    expect(toasts()[0].dataset.level).toBe('success');
  });

  it('promise() moves loading -> success and loading -> error', async () => {
    await manager.promise(Promise.resolve({ n: 7 }), { loading: 'Saving', success: (d: { n: number }) => `Saved ${d.n}`, error: 'Nope' });
    await vi.waitFor(() => expect(toasts().some((t) => t.textContent?.includes('Saved 7'))).toBe(true));
    await manager.promise(Promise.reject(new Error('boom')), { loading: 'Saving', success: 'ok', error: (e: Error) => `Failed: ${e.message}` }).catch(() => {});
    await vi.waitFor(() => expect(toasts().some((t) => t.textContent?.includes('Failed: boom'))).toBe(true));
  });

  it('ignores update/dismiss for an unknown id', () => {
    expect(() => {
      manager.update('nope', { message: 'x' });
      manager.dismiss('nope');
    }).not.toThrow();
  });

  it('destroy() removes everything and leaves no timer that throws afterwards', async () => {
    const errors: unknown[] = [];
    const onError = (e: ErrorEvent) => errors.push(e.message);
    window.addEventListener('error', onError);
    manager.show({ message: 'timer', duration: 120 });
    await waitForToasts(1);
    manager.destroy();
    expect(document.querySelectorAll('.editora-toast-container').length).toBe(0);
    await new Promise((r) => setTimeout(r, 400));
    window.removeEventListener('error', onError);
    expect(errors).toEqual([]);
  });
});

describe('update() and dismiss() right after show()', () => {
  it('applies an update issued before the toast has been registered', async () => {
    const toast = manager.show({ message: 'working', level: 'loading', duration: 0 });
    manager.update(toast.id, { message: 'done', level: 'success' }); // same tick as show()
    await vi.waitFor(() => expect(messageOf(toasts()[0]).textContent).toBe('done'));
    expect(toasts()[0].dataset.level).toBe('success');
  });

  it('dismisses a toast dismissed in the same tick it was shown', async () => {
    const toast = manager.show({ message: 'gone', duration: 0 });
    expect(toast.dismiss()).toBe(true);
    // The toast is registered, rendered and then hidden after this tick, so "no toasts yet" proves nothing:
    // wait out the whole sequence, then check that nothing is left on screen or in the store.
    await new Promise((r) => setTimeout(r, 2000));
    expect(toasts().length).toBe(0);
    expect(manager.getToasts().length).toBe(0);
  });

  it('resolves a promise() toast even when the promise is already settled', async () => {
    await manager.promise(Promise.resolve({ n: 1 }), { loading: 'Saving', success: 'Saved', error: 'Nope' });
    await vi.waitFor(() => expect(toasts().some((t) => t.dataset.level === 'success' && t.textContent?.includes('Saved'))).toBe(true));
    expect(toasts().some((t) => t.dataset.level === 'loading')).toBe(false);
  });

  it('still reports false for an id that was never shown', () => {
    expect(manager.update('never-shown', { message: 'x' })).toBe(false);
    expect(manager.dismiss('never-shown')).toBe(false);
  });
});
