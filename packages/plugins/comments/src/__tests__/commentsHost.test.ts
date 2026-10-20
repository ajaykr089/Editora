import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CommentsPlugin, configureComments, getCommentThreads, setCommentThreads } from '../index';
import type { CommentThread, CommentsOptions } from '../index';

const HTML = '<p>Alpha beta gamma delta</p><p>Epsilon zeta eta</p>';
const settle = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

let plugins: Array<ReturnType<typeof CommentsPlugin>> = [];
let roots: HTMLElement[] = [];

/** An editor shaped like the real one: root, toolbar button, editable content. */
function editor(html = HTML, withButton = true): HTMLElement {
  const root = document.createElement('div');
  root.className = 'rte-editor';
  root.innerHTML = `${withButton ? '<div class="rte-toolbar"><button data-command="addComment"></button></div>' : ''}<div class="rte-content" contenteditable="true">${html}</div>`;
  document.body.appendChild(root);
  roots.push(root);
  return root;
}
const contentOf = (root: HTMLElement) => root.querySelector('.rte-content') as HTMLElement;
// What the toolbar does before it runs a command: say which editor it is for.
const ctx = (root: HTMLElement) => {
  (window as unknown as Record<string, unknown>).__editoraCommandEditorRoot = root;
  return { editorElement: root, contentElement: contentOf(root) } as never;
};

function make(options?: CommentsOptions) {
  const plugin = CommentsPlugin(options);
  plugins.push(plugin);
  return plugin;
}

function anchored(id: string, text: string, extra: Partial<CommentThread> = {}): { html: string; thread: CommentThread } {
  return {
    html: `<span id="anchor-${id}" class="rte-comment-anchor" data-comment-id="${id}">${text}</span>`,
    thread: {
      id,
      anchorId: `anchor-${id}`,
      quote: text,
      author: { name: 'Ada', id: 'ada' },
      text: `about ${text}`,
      createdAt: '2026-10-19T10:00:00.000Z',
      resolved: false,
      replies: [],
      ...extra,
    },
  };
}

function select(root: HTMLElement, text: string): void {
  const walker = document.createTreeWalker(contentOf(root), NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const at = node.textContent!.indexOf(text);
    if (at === -1) continue;
    const range = document.createRange();
    range.setStart(node, at);
    range.setEnd(node, at + text.length);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    return;
  }
  throw new Error(text);
}

function type(field: HTMLTextAreaElement, value: string): void {
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

function post(root: HTMLElement, plugin: ReturnType<typeof CommentsPlugin>, text: string, selected?: string): void {
  if (selected) select(root, selected);
  plugin.commands?.addComment?.(undefined, ctx(root));
  type(root.querySelector('.new-comment-textarea')!, text);
  (root.querySelector('.rte-comment-composer') as HTMLFormElement).requestSubmit();
}

const cards = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>('.rte-comment-item'));

beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  plugins.forEach((plugin) => plugin.destroy?.());
  plugins = [];
  roots = [];
  window.getSelection()?.removeAllRanges();
  document.body.innerHTML = '';
  document.getElementById('rte-comments-orphans')?.remove();
  window.localStorage.clear();
});

describe('who is commenting', () => {
  it('signs new comments, replies and resolutions with the current user, and shows their picture', () => {
    const root = editor();
    const plugin = make({ currentUser: { id: 'u1', name: 'Grace Hopper', avatar: 'https://img.test/grace.png' } });
    post(root, plugin, 'first', 'beta');
    const card = cards(root)[0];
    expect(card.querySelector('.rte-comment-author')!.textContent).toBe('Grace Hopper');
    const img = card.querySelector<HTMLImageElement>('.rte-comment-avatar img')!;
    expect(img.getAttribute('src')).toBe('https://img.test/grace.png');
    expect(img.referrerPolicy).toBe('no-referrer');
    expect(card.querySelector('.rte-comment-avatar')!.textContent).toBe('GH');

    const reply = card.querySelector<HTMLTextAreaElement>('.rte-comment-reply-textarea')!;
    type(reply, 'answer');
    reply.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    (cards(root)[0].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();

    const [thread] = getCommentThreads(root);
    expect(thread.author).toEqual({ id: 'u1', name: 'Grace Hopper', avatar: 'https://img.test/grace.png' });
    expect(thread.replies[0].author.name).toBe('Grace Hopper');
    expect(thread.resolvedBy).toEqual({ id: 'u1', name: 'Grace Hopper', avatar: 'https://img.test/grace.png' });
  });

  it('falls back to the initials when the picture does not load', () => {
    const root = editor();
    const plugin = make({ currentUser: { name: 'Grace Hopper', avatar: '/missing.png' } });
    post(root, plugin, 'first', 'beta');
    const img = root.querySelector<HTMLImageElement>('.rte-comment-avatar img')!;
    img.dispatchEvent(new Event('error'));
    expect(root.querySelector('.rte-comment-avatar img')).toBeNull();
    expect(root.querySelector('.rte-comment-avatar')!.textContent).toBe('GH');
  });

  it('is "User" when nobody said', () => {
    const root = editor();
    const plugin = make();
    post(root, plugin, 'first', 'beta');
    expect(getCommentThreads(root)[0].author).toEqual({ name: 'User' });
  });
});

describe('what the host is told', () => {
  it('calls onChange with every thread and why, and dispatches a DOM event with the same data', () => {
    const root = editor();
    const calls: Array<{ threads: CommentThread[]; change: unknown }> = [];
    const plugin = make({ onChange: (threads, change) => calls.push({ threads, change }) });
    const events: unknown[] = [];
    root.addEventListener('editora:comments-change', (event) => events.push((event as CustomEvent).detail));

    post(root, plugin, 'one', 'beta');
    const id = getCommentThreads(root)[0].id;
    expect(calls.map((c) => c.change)).toEqual([{ reason: 'create', threadId: id }]);
    expect(calls[0].threads).toHaveLength(1);
    expect(events).toHaveLength(1);
    expect((events[0] as { threads: unknown[] }).threads).toHaveLength(1);

    const reply = cards(root)[0].querySelector<HTMLTextAreaElement>('.rte-comment-reply-textarea')!;
    type(reply, 'r');
    reply.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    (cards(root)[0].querySelector('[data-action="more"]') as HTMLButtonElement).click();
    (cards(root)[0].querySelector('.rte-comment-menu-item[data-action="edit"]') as HTMLButtonElement).click();
    const field = root.querySelector<HTMLTextAreaElement>('.rte-comment-edit-textarea')!;
    type(field, 'one, edited');
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    (cards(root)[0].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();
    root.querySelector<HTMLButtonElement>('.rte-comments-tab[data-filter="resolved"]')!.click();
    (cards(root)[0].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();

    expect(calls.map((c) => (c.change as { reason: string }).reason)).toEqual(['create', 'reply', 'edit', 'resolve', 'reopen']);
    const last = calls[calls.length - 1].threads[0];
    expect(last.text).toBe('one, edited');
    expect(last.replies).toHaveLength(1);
    expect(last.resolved).toBe(false);
  });

  it('does not list what was deleted, and lists it again when Undo brings it back', () => {
    const root = editor();
    const calls: CommentThread[][] = [];
    const plugin = make({ onChange: (threads) => calls.push(threads) });
    post(root, plugin, 'one', 'beta');
    post(root, plugin, 'two', 'zeta');
    (cards(root)[0].querySelector('[data-action="more"]') as HTMLButtonElement).click();
    (cards(root)[0].querySelector('.rte-comment-menu-item[data-action="delete"]') as HTMLButtonElement).click();
    expect(calls[calls.length - 1].map((t) => t.text)).toEqual(['two']);
    expect(getCommentThreads(root).map((t) => t.text)).toEqual(['two']);

    (root.querySelector('.rte-comments-toast-action') as HTMLButtonElement).click();
    expect(getCommentThreads(root).map((t) => t.text).sort()).toEqual(['one', 'two']);
    expect(calls[calls.length - 1]).toHaveLength(2);
  });

  it('survives an onChange that throws', () => {
    const root = editor();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const plugin = make({
      onChange: () => {
        throw new Error('host bug');
      },
    });
    post(root, plugin, 'one', 'beta');
    expect(cards(root)).toHaveLength(1);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it('reports a Resolve that the document undid, as a change from the document', async () => {
    const a = anchored('t1', 'beta');
    const root = editor(`<p>Alpha ${a.html} gamma</p>`);
    const calls: Array<[CommentThread[], { reason: string }]> = [];
    make({ initialThreads: [a.thread], onChange: (threads, change) => calls.push([threads, change as { reason: string }]) });
    await settle();
    const plugin = plugins[0];
    plugin.commands?.toggleComments?.(undefined, ctx(root));
    (cards(root)[0].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();
    expect(getCommentThreads(root)[0].resolved).toBe(true);

    // What the editor's Undo does: the document goes back to how it was.
    root.querySelector('.rte-comment-anchor')!.classList.remove('rte-comment-anchor-resolved');
    await settle();
    expect(getCommentThreads(root)[0].resolved).toBe(false);
    expect(calls[calls.length - 1][1].reason).toBe('document');
  });
});

describe('threads from the host', () => {
  it('initialThreads are shown, found by their highlight in the document', async () => {
    const a = anchored('t1', 'beta');
    const b = anchored('t2', 'zeta', { resolved: true, resolvedBy: { name: 'Bob' } });
    const root = editor(`<p>Alpha ${a.html} gamma</p><p>Epsilon ${b.html} eta</p>`);
    make({ initialThreads: [a.thread, b.thread] });
    await settle();

    const plugin = plugins[0];
    plugin.commands?.toggleComments?.(undefined, ctx(root));
    expect(cards(root).map((card) => card.querySelector('.rte-comment-text')!.textContent)).toEqual(['about beta']);
    root.querySelector<HTMLButtonElement>('.rte-comments-tab[data-filter="resolved"]')!.click();
    expect(cards(root)[0].querySelector('.rte-comment-status')!.textContent).toContain('Resolved by Bob');
    // The document agrees with the data about what is resolved.
    expect(root.querySelector('#anchor-t2')!.classList.contains('rte-comment-anchor-resolved')).toBe(true);
    expect(root.querySelector('#anchor-t1')!.classList.contains('rte-comment-anchor-resolved')).toBe(false);
  });

  it('are not reported back through onChange', async () => {
    const a = anchored('t1', 'beta');
    const root = editor(`<p>Alpha ${a.html} gamma</p>`);
    const onChange = vi.fn();
    make({ initialThreads: [a.thread], onChange });
    await settle();
    setCommentThreads(root, [a.thread]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('setCommentThreads replaces what is there, and keeps a thread whose text is not in the document', () => {
    const a = anchored('t1', 'beta');
    const root = editor(`<p>Alpha ${a.html} gamma</p>`);
    const plugin = make();
    plugin.commands?.toggleComments?.(undefined, ctx(root));
    post(root, plugin, 'mine', 'gamma');

    const gone = anchored('t9', 'nowhere');
    setCommentThreads(root, [a.thread, gone.thread]);
    expect(cards(root)).toHaveLength(1); // only the one with its text in the document is shown
    expect(getCommentThreads(root).map((t) => t.id)).toEqual(['t1', 't9']); // but none is lost
  });

  it('throws away junk instead of failing', () => {
    const root = editor();
    make().commands?.toggleComments?.(undefined, ctx(root));
    expect(() => setCommentThreads(root, 'junk' as never)).not.toThrow();
    expect(() => setCommentThreads(root, [null, { id: '"]' }] as never)).not.toThrow();
    expect(getCommentThreads(root)).toEqual([]);
  });

  it('getCommentThreads works from anything inside the editor, and is empty elsewhere', () => {
    const root = editor();
    const plugin = make();
    post(root, plugin, 'one', 'beta');
    expect(getCommentThreads(contentOf(root))).toHaveLength(1);
    expect(getCommentThreads(document.body)).toEqual([]);
  });
});

describe('which plugin call belongs to which editor', () => {
  it('a command binds the call it came from, whatever order things were made in', async () => {
    const a = anchored('ta', 'beta');
    const b = anchored('tb', 'zeta');
    const first = editor(`<p>Alpha ${a.html}</p>`);
    const second = editor(`<p>Epsilon ${b.html}</p>`);
    const forFirst = make({ initialThreads: [a.thread], currentUser: { name: 'One' } });
    const forSecond = make({ initialThreads: [b.thread], currentUser: { name: 'Two' } });
    await settle();
    expect(getCommentThreads(first).map((t) => t.id)).toEqual(['ta']);
    expect(getCommentThreads(second).map((t) => t.id)).toEqual(['tb']);

    // The second editor's toolbar ran the second plugin's command: it is the one that counts.
    forSecond.commands?.toggleComments?.(undefined, ctx(second));
    forFirst.commands?.toggleComments?.(undefined, ctx(first));
    post(second, forSecond, 'by two');
    post(first, forFirst, 'by one');
    expect(getCommentThreads(second).find((t) => t.text === 'by two')!.author.name).toBe('Two');
    expect(getCommentThreads(first).find((t) => t.text === 'by one')!.author.name).toBe('One');
  });

  it('init with the editor element binds at once (the web component does this)', () => {
    const a = anchored('t1', 'beta');
    const root = editor(`<p>Alpha ${a.html}</p>`, false); // no toolbar button: nothing else could find it
    const plugin = make({ initialThreads: [a.thread] });
    plugin.init?.({ editorElement: root });
    expect(getCommentThreads(root).map((t) => t.id)).toEqual(['t1']);
  });

  it('configureComments says it explicitly', () => {
    const a = anchored('t1', 'beta');
    const root = editor(`<p>Alpha ${a.html}</p>`, false);
    configureComments(root, { initialThreads: [a.thread], currentUser: 'Zed' });
    expect(getCommentThreads(root).map((t) => t.id)).toEqual(['t1']);
  });

  it('an editor without comments is left alone', async () => {
    const withComments = editor();
    const without = editor(HTML, false);
    make({ initialThreads: [anchored('t1', 'beta').thread] });
    await settle();
    expect(getCommentThreads(without)).toEqual([]);
    expect(getCommentThreads(withComments).map((t) => t.id)).toEqual(['t1']);
  });
});

describe('who may change a comment', () => {
  const setup = async (options: CommentsOptions) => {
    const mine = anchored('t1', 'beta', { author: { id: 'me', name: 'Me' } });
    const theirs = anchored('t2', 'zeta', { author: { id: 'you', name: 'You' } });
    const root = editor(`<p>Alpha ${mine.html}</p><p>Epsilon ${theirs.html}</p>`);
    const plugin = make({ initialThreads: [mine.thread, theirs.thread], ...options });
    await settle();
    plugin.commands?.toggleComments?.(undefined, ctx(root));
    return root;
  };
  const hasMenu = (root: HTMLElement, text: string) =>
    !!cards(root).find((card) => card.querySelector('.rte-comment-text')!.textContent === text)!.querySelector('[data-action="more"]');

  it('by default people change their own comments only, when there are ids', async () => {
    const root = await setup({ currentUser: { id: 'me', name: 'Me' } });
    expect(hasMenu(root, 'about beta')).toBe(true);
    expect(hasMenu(root, 'about zeta')).toBe(false);
    // Anyone can still resolve and reply.
    expect(cards(root)[1].querySelector('[data-action="resolve"]')).not.toBeNull();
    expect(cards(root)[1].querySelector('.rte-comment-reply-textarea')).not.toBeNull();
  });

  it('everyone may when the user has no id', async () => {
    const root = await setup({ currentUser: 'Me' });
    expect(hasMenu(root, 'about zeta')).toBe(true);
  });

  it('canModify decides when it is given', async () => {
    const root = await setup({ currentUser: { id: 'me', name: 'Me' }, canModify: (author) => author.id === 'you' });
    expect(hasMenu(root, 'about beta')).toBe(false);
    expect(hasMenu(root, 'about zeta')).toBe(true);
  });
});

describe('highlights with no thread behind them', () => {
  const orphanStyle = () => document.getElementById('rte-comments-orphans')?.textContent ?? '';

  it('lose their colour, and get it back when their thread is loaded, even if the HTML arrives later', async () => {
    const a = anchored('t1', 'beta');
    const root = editor('<p>Alpha</p>');
    make();
    await settle();
    contentOf(root).innerHTML = `<p>Alpha ${a.html} gamma</p>`; // loaded after the editor started, with no input event
    await settle();
    expect(orphanStyle()).toContain('[id="anchor-t1"]');
    expect(orphanStyle()).toContain('background: none');

    setCommentThreads(root, [a.thread]);
    expect(orphanStyle()).toBe('');
  });

  it('never put the document through a change just to show this', async () => {
    const a = anchored('t1', 'beta');
    const root = editor(`<p>Alpha ${a.html}</p>`);
    const before = contentOf(root).innerHTML;
    make();
    await settle();
    expect(contentOf(root).innerHTML).toBe(before);
  });
});

describe('a thread whose text comes back', () => {
  it('is listed again, as a change from the document', async () => {
    const a = anchored('t1', 'beta');
    const root = editor(`<p>Alpha ${a.html} gamma</p>`);
    const reasons: string[] = [];
    const plugin = make({ initialThreads: [a.thread], onChange: (_t, change) => reasons.push(change.reason) });
    await settle();
    plugin.commands?.toggleComments?.(undefined, ctx(root));
    (cards(root)[0].querySelector('[data-action="more"]') as HTMLButtonElement).click();
    (cards(root)[0].querySelector('.rte-comment-menu-item[data-action="delete"]') as HTMLButtonElement).click();
    expect(getCommentThreads(root)).toEqual([]);

    contentOf(root).innerHTML = `<p>Alpha ${a.html} gamma</p>`; // the editor's own Undo
    await settle();
    expect(getCommentThreads(root).map((t) => t.id)).toEqual(['t1']);
    expect(reasons).toEqual(['delete', 'document']);
  });
});

describe('storageKey (comments kept in localStorage)', () => {
  const KEY = 'my-doc-comments';
  const stored = () => JSON.parse(window.localStorage.getItem(KEY) || 'null') as CommentThread[] | null;

  it('saves after every change, and the next editor with the same key starts with them', async () => {
    const root = editor();
    const plugin = make({ storageKey: KEY, currentUser: { id: 'u1', name: 'Grace' } });
    expect(stored()).toBeNull(); // nothing is written until something happens
    post(root, plugin, 'first', 'beta');
    expect(stored()!.map((t) => t.text)).toEqual(['first']);
    expect(stored()![0].author).toEqual({ id: 'u1', name: 'Grace' });

    const reply = cards(root)[0].querySelector<HTMLTextAreaElement>('.rte-comment-reply-textarea')!;
    type(reply, 'a reply');
    reply.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    expect(stored()![0].replies.map((r) => r.text)).toEqual(['a reply']);
    const html = contentOf(root).innerHTML;

    // "Reload": a new editor, with the document's HTML saved by whoever saves it.
    plugins.forEach((p) => p.destroy?.());
    plugins = [];
    document.body.innerHTML = '';
    const again = editor(html);
    const second = make({ storageKey: KEY });
    await settle();
    second.commands?.toggleComments?.(undefined, ctx(again));
    expect(cards(again).map((card) => card.querySelector('.rte-comment-text')!.textContent)).toEqual(['first']);
    expect(cards(again)[0].querySelector('.rte-comment-reply-text')!.textContent).toBe('a reply');
    expect(document.getElementById('rte-comments-orphans')).toBeNull(); // the highlight is live
  });

  it('what is stored wins over initialThreads, including an empty list', async () => {
    const a = anchored('t1', 'beta');
    window.localStorage.setItem(KEY, JSON.stringify([]));
    const root = editor(`<p>Alpha ${a.html}</p>`);
    make({ storageKey: KEY, initialThreads: [a.thread] });
    await settle();
    expect(getCommentThreads(root)).toEqual([]);
  });

  it('uses initialThreads when nothing is stored yet', async () => {
    const a = anchored('t1', 'beta');
    const root = editor(`<p>Alpha ${a.html}</p>`);
    make({ storageKey: KEY, initialThreads: [a.thread] });
    await settle();
    expect(getCommentThreads(root).map((t) => t.id)).toEqual(['t1']);
  });

  it('starts empty when what is stored is not comments', async () => {
    window.localStorage.setItem(KEY, '{not json');
    const root = editor();
    make({ storageKey: KEY });
    await settle();
    expect(getCommentThreads(root)).toEqual([]);
    window.localStorage.setItem(KEY, JSON.stringify({ a: 1 }));
    const other = editor();
    make({ storageKey: KEY });
    await settle();
    expect(getCommentThreads(other)).toEqual([]);
  });

  it('keeps going, and says so once, when localStorage refuses', () => {
    const root = editor();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const plugin = make({ storageKey: KEY });
    post(root, plugin, 'one', 'beta');
    post(root, plugin, 'two', 'zeta');
    set.mockRestore();
    expect(cards(root)).toHaveLength(2);
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('localStorage'))).toHaveLength(1);
    warn.mockRestore();
  });

  it('writes nothing without a key, and still calls onChange when there is one', () => {
    const root = editor();
    const onChange = vi.fn();
    const plugin = make({ onChange });
    post(root, plugin, 'one', 'beta');
    expect(window.localStorage.length).toBe(0);
    expect(onChange).toHaveBeenCalledTimes(1);

    const withBoth = editor();
    const calls: string[] = [];
    const second = make({ storageKey: KEY, onChange: () => calls.push(String(!!stored())) });
    post(withBoth, second, 'two', 'zeta');
    expect(calls).toEqual(['true']); // already saved by the time the host hears about it
  });

  it('removing the last comment is saved too', () => {
    const root = editor();
    const plugin = make({ storageKey: KEY });
    post(root, plugin, 'one', 'beta');
    (cards(root)[0].querySelector('[data-action="more"]') as HTMLButtonElement).click();
    (cards(root)[0].querySelector('.rte-comment-menu-item[data-action="delete"]') as HTMLButtonElement).click();
    expect(stored()).toEqual([]);
  });
});
