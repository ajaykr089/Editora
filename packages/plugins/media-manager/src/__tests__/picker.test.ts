import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetLocalLibrary } from '../providers';
import { MediaManagerPlugin } from '../MediaManagerPlugin.native';
import type { MediaItem, MediaProvider, MediaQuery } from '../types/media';

let editor: HTMLElement;

const makeItem = (n: number, extra: Partial<MediaItem> = {}): MediaItem => ({
  id: `m${n}`,
  name: `photo-${n}.jpg`,
  type: 'image',
  src: `https://cdn.test/${n}.jpg`,
  thumbnailUrl: `https://cdn.test/${n}-t.jpg`,
  size: 2048 * n,
  width: 800,
  height: 600,
  mime: 'image/jpeg',
  createdAt: 0,
  metadata: {},
  ...extra,
});

/** A library of `total` items behind a provider that pages and searches the way a server does. */
const makeProvider = (total = 30, overrides: Partial<MediaProvider> = {}) => {
  let all = Array.from({ length: total }, (_, i) => makeItem(i + 1));
  const list = vi.fn(async (query: MediaQuery = {}) => {
    const matching = all.filter((m) => !query.search || m.name.includes(query.search));
    const start = ((query.page ?? 1) - 1) * (query.limit ?? 24);
    return { items: matching.slice(start, start + (query.limit ?? 24)), total: matching.length };
  });
  const provider: MediaProvider = {
    name: 'test',
    upload: async (file) => makeItem(99, { name: file.name, src: `https://cdn.test/${file.name}` }),
    list,
    delete: vi.fn(async (id: string) => {
      all = all.filter((m) => m.id !== id);
    }),
    ...overrides,
  };
  return { provider, list, setAll: (items: MediaItem[]) => (all = items) };
};

const dialog = () => document.querySelector('.rte-media-dialog') as HTMLElement;
const q = <T extends HTMLElement = HTMLElement>(selector: string) => dialog().querySelector(selector) as T;
const tiles = () => [...dialog().querySelectorAll<HTMLElement>('.rte-mp-tile[data-id]')];
const insertButton = () => q<HTMLButtonElement>('#insert-btn');
const placeCaret = () => {
  const range = document.createRange();
  range.setStart(editor.querySelector('p')!.firstChild!, 5);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
};
const open = (provider: MediaProvider | undefined, command: 'insertImage' | 'insertVideo' = 'insertImage') => {
  placeCaret();
  (MediaManagerPlugin(provider ? { provider } : undefined).commands as any)[command](undefined, { contentElement: editor });
};
const loaded = () => vi.waitFor(() => expect(tiles().length).toBeGreaterThan(0));
const click = (el: Element, init: MouseEventInit = {}) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...init }));
const key = (el: Element, k: string, init: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init }));

beforeEach(() => {
  resetLocalLibrary();
  document.body.innerHTML = '<div class="rte-content" contenteditable="true" tabindex="0"><p>Alpha beta gamma</p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
  editor.focus();
});
afterEach(() => {
  document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
  document.body.innerHTML = '';
  vi.useRealTimers();
  delete (window as any).execEditorCommand;
});

describe('the library', () => {
  it('opens on the library when the provider can list, with placeholders while it loads', async () => {
    const { provider } = makeProvider();
    open(provider);
    expect(q('.tab-library').getAttribute('aria-selected')).toBe('true');
    expect(dialog().querySelectorAll('.rte-mp-tile.is-skeleton').length).toBeGreaterThan(0);
    await loaded();
    expect(tiles()).toHaveLength(24);
    expect(q('[role="listbox"]').getAttribute('aria-multiselectable')).toBe('true');
    expect(tiles()[0].getAttribute('aria-label')).toBe('photo-1.jpg');
    expect(tiles()[0].querySelector('img')!.getAttribute('src')).toBe('https://cdn.test/1-t.jpg');
  });

  it('asks the provider for the kind of media the command is about', async () => {
    const { provider, list, setAll } = makeProvider();
    setAll([makeItem(1, { type: 'video', mime: 'video/mp4', name: 'clip.mp4' })]);
    open(provider, 'insertVideo');
    await loaded();
    expect(list.mock.calls[0][0]).toMatchObject({ type: 'video', page: 1, limit: 24 });
  });

  it('keeps a library of this browser when the provider cannot list, and starts at Upload while it is empty', () => {
    open(undefined);
    expect(q('.tab-library')).not.toBeNull();
    expect(q('.tab-upload').getAttribute('aria-selected')).toBe('true');
  });

  it('has no library at all when localLibrary is off', () => {
    placeCaret();
    (MediaManagerPlugin({ localLibrary: false }).commands as any).insertImage(undefined, { contentElement: editor });
    expect(q('.tab-library')).toBeNull();
    expect(q('.tab-upload').getAttribute('aria-selected')).toBe('true');
    expect(q('.rte-mp-search').hidden).toBe(true);
  });

  it('remembers what was uploaded and opens on it next time, with search and a caption field', async () => {
    const plugin = MediaManagerPlugin({ uploadHandler: async (file) => `https://cdn.test/${file.name}` });
    const { uploadMedia } = await import('../uploadService');
    const config = { uploadHandler: async (file: File) => `https://cdn.test/${file.name}` };
    await uploadMedia(new File(['a'], 'lake.png', { type: 'image/png' }), { config });
    await uploadMedia(new File(['b'], 'dune.png', { type: 'image/png' }), { config });
    placeCaret();
    (plugin.commands as any).insertImage(undefined, { contentElement: editor });
    await vi.waitFor(() => expect(q('.tab-library').getAttribute('aria-selected')).toBe('true'));
    await loaded();
    expect(tiles()).toHaveLength(2);
    click(tiles()[0]);
    expect(q('#detail-caption')).not.toBeNull();
    q<HTMLInputElement>('#detail-caption').value = 'Sunset';
    q<HTMLInputElement>('#detail-caption').dispatchEvent(new Event('input', { bubbles: true }));
    insertButton().click();
    expect(editor.querySelector('figure figcaption')!.textContent).toBe('Sunset');
  });

  it('loads the next page on request, without repeating items', async () => {
    const { provider, list } = makeProvider(30);
    open(provider);
    await loaded();
    q<HTMLButtonElement>('.rte-mp-more').click();
    await vi.waitFor(() => expect(tiles()).toHaveLength(30));
    expect(list.mock.calls[1][0]).toMatchObject({ page: 2 });
    expect(q('.rte-mp-more')).toBeNull();
  });

  it('searches after the typing pauses, and says so when nothing matches', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { provider, list } = makeProvider();
    open(provider);
    await loaded();

    const input = q<HTMLInputElement>('#mp-search');
    input.value = 'photo-1';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.value = 'photo-12';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(list).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(350);
    await vi.waitFor(() => expect(list).toHaveBeenCalledTimes(2));
    expect(list.mock.calls[1][0]).toMatchObject({ search: 'photo-12', page: 1 });
    await vi.waitFor(() => expect(tiles()).toHaveLength(1));

    input.value = 'nothing like this';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(350);
    await vi.waitFor(() => expect(q('.rte-mp-empty')).not.toBeNull());
    expect(q('.rte-mp-empty strong').textContent).toBe('No results for “nothing like this”');
  });

  it('invites an upload when the library is empty', async () => {
    const { provider } = makeProvider(0);
    open(provider);
    await vi.waitFor(() => expect(q('.rte-mp-empty')).not.toBeNull());
    expect(q('.rte-mp-empty strong').textContent).toBe('No images in your library yet');
    q<HTMLButtonElement>('.rte-mp-empty button').click();
    expect(q('.tab-upload').getAttribute('aria-selected')).toBe('true');
  });

  it('shows the server failure in an alert, and tries again', async () => {
    let fail = true;
    const { provider } = makeProvider(5, {
      list: async () => {
        if (fail) throw new Error('The server is down.');
        return { items: [makeItem(1)], total: 1 };
      },
    });
    open(provider);
    await vi.waitFor(() => expect(q('.rte-mp-error')).not.toBeNull());
    expect(q('.rte-mp-error').getAttribute('role')).toBe('alert');
    expect(q('.rte-mp-error strong').textContent).toBe('The server is down.');
    fail = false;
    q<HTMLButtonElement>('.rte-mp-error button').click();
    await vi.waitFor(() => expect(tiles()).toHaveLength(1));
  });
});

describe('choosing and inserting', () => {
  it('chooses by click, counts, and labels the button for what will be inserted', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    expect(insertButton().disabled).toBe(true);
    expect(q('.rte-mp-count').textContent).toBe('Select media to insert');

    click(tiles()[0]);
    expect(tiles()[0].getAttribute('aria-selected')).toBe('true');
    expect(insertButton().disabled).toBe(false);
    expect(insertButton().textContent).toBe('Insert image');
    click(tiles()[2]);
    expect(insertButton().textContent).toBe('Insert 2 images');
    expect(q('.rte-mp-count').textContent).toBe('2 selected');
    click(tiles()[2]);
    expect(insertButton().textContent).toBe('Insert image');
    click(tiles()[0]);
    expect(insertButton().disabled).toBe(true);
  });

  it('chooses a range with Shift', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    click(tiles()[1]);
    click(tiles()[4], { shiftKey: true });
    expect(tiles().filter((t) => t.getAttribute('aria-selected') === 'true').map((t) => t.dataset.id)).toEqual(['m2', 'm3', 'm4', 'm5']);
  });

  it('inserts everything chosen, in the order it was chosen, at the caret, as one undoable step', async () => {
    const recorded = vi.fn();
    (window as any).execEditorCommand = (c: string, ...a: any[]) => c === 'recordDomTransaction' && recorded(...a);
    const onInput = vi.fn();
    editor.addEventListener('input', onInput);

    const { provider } = makeProvider();
    open(provider);
    await loaded();
    click(tiles()[2]);
    click(tiles()[0]);
    insertButton().click();

    expect(document.querySelector('.rte-media-overlay')).toBeNull();
    expect([...editor.querySelectorAll('img')].map((i) => i.getAttribute('src'))).toEqual(['https://cdn.test/3.jpg', 'https://cdn.test/1.jpg']);
    expect(editor.textContent).toBe('Alpha beta gamma');
    expect(recorded).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(1);
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.startContainer.previousSibling ?? range.startContainer).toBeTruthy();
  });

  it('inserts at once on double-click', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    tiles()[3].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(editor.querySelectorAll('img')).toHaveLength(1);
    expect(editor.querySelector('img')!.getAttribute('src')).toBe('https://cdn.test/4.jpg');
  });

  it('can be driven with the keyboard: arrows move, Space chooses, Enter inserts', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    const first = tiles()[0];
    first.tabIndex = 0;
    first.focus();
    key(first, 'ArrowRight');
    expect(document.activeElement).toBe(tiles()[1]);
    expect(tiles()[1].tabIndex).toBe(0);
    expect(tiles()[0].tabIndex).toBe(-1);
    key(tiles()[1], 'ArrowLeft');
    key(tiles()[0], 'End');
    expect(document.activeElement).toBe(tiles()[tiles().length - 1]);
    key(tiles()[tiles().length - 1], 'Home');
    key(tiles()[0], 'ArrowRight');
    key(tiles()[1], ' ');
    expect(tiles()[1].getAttribute('aria-selected')).toBe('true');
    key(tiles()[1], 'Enter');
    expect(editor.querySelector('img')!.getAttribute('src')).toBe('https://cdn.test/2.jpg');
  });

  it('moves by rows with the up and down arrows, as many columns as the grid has', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    // jsdom has no layout: say the grid has 4 columns.
    tiles().forEach((t, i) => Object.defineProperty(t, 'offsetTop', { configurable: true, value: Math.floor(i / 4) * 100 }));
    tiles()[1].focus();
    key(tiles()[1], 'ArrowDown');
    expect(document.activeElement).toBe(tiles()[5]);
    key(tiles()[5], 'ArrowUp');
    expect(document.activeElement).toBe(tiles()[1]);
  });

  it('selects everything loaded with Ctrl+A', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    tiles()[0].focus();
    key(tiles()[0], 'a', { ctrlKey: true });
    expect(tiles().every((t) => t.getAttribute('aria-selected') === 'true')).toBe(true);
    expect(q('.rte-mp-count').textContent).toBe('24 selected');
  });

  it('inserts a video as a video', async () => {
    const { provider, setAll } = makeProvider();
    setAll([makeItem(1, { type: 'video', mime: 'video/mp4', name: 'clip.mp4', src: 'https://cdn.test/clip.mp4', thumbnailUrl: undefined })]);
    open(provider, 'insertVideo');
    await loaded();
    expect(tiles()[0].getAttribute('aria-label')).toBe('clip.mp4, video');
    click(tiles()[0]);
    expect(insertButton().textContent).toBe('Insert video');
    insertButton().click();
    const video = editor.querySelector('video')!;
    expect(video.getAttribute('src')).toBe('https://cdn.test/clip.mp4');
    expect(video.controls).toBe(true);
  });
});

describe('the details panel and alt text', () => {
  it('shows what is known about the item last touched, and prefills the alt text from the library', async () => {
    const { provider, setAll } = makeProvider();
    setAll([makeItem(1, { alt: 'A red barn' })]);
    open(provider);
    await loaded();
    expect(dialog().querySelector('.rte-mp-details')!.hasAttribute('hidden')).toBe(true);
    click(tiles()[0]);
    const panel = q('.rte-mp-details');
    expect(panel.hidden).toBe(false);
    expect(panel.querySelector('.rte-mp-meta-name')!.textContent).toBe('photo-1.jpg');
    expect(panel.querySelector('.rte-mp-meta')!.textContent).toBe('800 × 600 · 2 KB · JPEG');
    expect(q<HTMLTextAreaElement>('#detail-alt').value).toBe('A red barn');
    insertButton().click();
    expect(editor.querySelector('img')!.getAttribute('alt')).toBe('A red barn');
  });

  it('inserts the alt text that was typed, for the item it was typed on', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    click(tiles()[0]);
    const alt = q<HTMLTextAreaElement>('#detail-alt');
    alt.value = 'A barn';
    alt.dispatchEvent(new Event('input', { bubbles: true }));
    click(tiles()[1]);
    expect(q<HTMLTextAreaElement>('#detail-alt').value).toBe('');
    insertButton().click();
    const [first, second] = [...editor.querySelectorAll('img')];
    expect(first.getAttribute('alt')).toBe('A barn');
    expect(second.hasAttribute('alt')).toBe(false);
  });

  it('marks an image decorative with an empty alt, which is not the same as no alt', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    click(tiles()[0]);
    const box = q<HTMLInputElement>('#detail-decorative');
    box.checked = true;
    box.dispatchEvent(new Event('change', { bubbles: true }));
    expect(q<HTMLTextAreaElement>('#detail-alt').disabled).toBe(true);
    insertButton().click();
    expect(editor.querySelector('img')!.getAttribute('alt')).toBe('');
  });

  it('warns that there is no description yet', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    click(tiles()[0]);
    expect(q('.rte-mp-details .rte-mp-hint').classList.contains('is-warning')).toBe(true);
    const alt = q<HTMLTextAreaElement>('#detail-alt');
    alt.value = 'x';
    alt.dispatchEvent(new Event('input', { bubbles: true }));
    expect(q('.rte-mp-details .rte-mp-hint').classList.contains('is-warning')).toBe(false);
  });

  it('deletes from the library after confirming, and drops it from the selection', async () => {
    const { provider } = makeProvider(3);
    open(provider);
    await loaded();
    click(tiles()[1]);
    [...q('.rte-mp-details').querySelectorAll('button')].find((b) => /Delete from library/.test(b.textContent ?? ''))!.click();
    await vi.waitFor(() => expect([...document.querySelectorAll('button')].some((b) => /^Delete$/.test(b.textContent?.trim() ?? ''))).toBe(true));
    [...document.querySelectorAll('button')].find((b) => /^Delete$/.test(b.textContent?.trim() ?? ''))!.click();
    await vi.waitFor(() => expect(tiles()).toHaveLength(2));
    expect(provider.delete).toHaveBeenCalledWith('m2');
    expect(insertButton().disabled).toBe(true);
  });

  it('offers no delete when the provider cannot delete', async () => {
    const { provider } = makeProvider(2, { delete: undefined });
    open(provider);
    await loaded();
    click(tiles()[0]);
    expect([...q('.rte-mp-details').querySelectorAll('button')].some((b) => /Delete/.test(b.textContent ?? ''))).toBe(false);
  });
});

describe('uploading in the picker', () => {
  const choose = (files: File[]) => {
    const input = q<HTMLInputElement>('#file-input');
    Object.defineProperty(input, 'files', { value: files, configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const file = (name = 'cat.png', size = 3) => {
    const f = new File(['x'], name, { type: 'image/png' });
    Object.defineProperty(f, 'size', { value: size });
    return f;
  };

  it('shows each file as a tile with its progress, chooses it when it is done, and inserts it', async () => {
    let finish!: (url: string) => void;
    let report!: (n: number) => void;
    open({
      name: 'slow',
      upload: (_f, ctx) =>
        new Promise((resolve) => {
          report = (fraction) => ctx.onProgress?.({ loaded: fraction * 10, total: 10, fraction });
          finish = (src) => resolve(makeItem(1, { src, name: 'cat.png' }));
        }),
    });
    choose([file()]);
    const tile = () => q('.rte-mp-queue .rte-mp-tile');
    expect(tile().classList.contains('is-uploading')).toBe(true);
    report(0.42);
    expect(tile().querySelector('.rte-mp-tile-status')!.textContent).toBe('Uploading 42%');
    expect(tile().querySelector('[role="progressbar"]')!.getAttribute('aria-valuenow')).toBe('42');
    expect(insertButton().disabled).toBe(true);

    finish('https://cdn.test/cat.png');
    await vi.waitFor(() => expect(tile().classList.contains('is-selected')).toBe(true));
    expect(insertButton().textContent).toBe('Insert image');
    insertButton().click();
    expect(editor.querySelector('img')!.getAttribute('src')).toBe('https://cdn.test/cat.png');
  });

  it('uploads several files at once and inserts all of them', async () => {
    open({ name: 'p', upload: async (f) => makeItem(Math.random() * 1000 | 0, { name: f.name, src: `https://cdn.test/${f.name}` }) });
    choose([file('a.png'), file('b.png')]);
    await vi.waitFor(() => expect(insertButton().textContent).toBe('Insert 2 images'));
    insertButton().click();
    expect([...editor.querySelectorAll('img')].map((i) => i.getAttribute('src'))).toEqual(['https://cdn.test/a.png', 'https://cdn.test/b.png']);
  });

  it('keeps a failed file as a tile with the reason, which can be retried', async () => {
    let attempts = 0;
    open({
      name: 'flaky',
      upload: async (f) => {
        if (++attempts === 1) throw new Error('The server is busy. Try again.');
        return makeItem(1, { name: f.name, src: 'https://cdn.test/ok.png' });
      },
    });
    choose([file('a.png')]);
    await vi.waitFor(() => expect(q('.rte-mp-queue .is-failed')).not.toBeNull());
    expect(q('.rte-mp-tile-status').getAttribute('role')).toBe('alert');
    expect(q('.rte-mp-tile-status').textContent).toBe('The server is busy. Try again.');
    q<HTMLButtonElement>('.rte-mp-tile-actions button[aria-label^="Retry"]').click();
    await vi.waitFor(() => expect(q('.rte-mp-queue .is-selected')).not.toBeNull());
  });

  it('refuses a file over the limit with a reason, and offers no retry for it', async () => {
    open({ name: 'p', upload: async () => makeItem(1) });
    choose([file('big.png', 50 * 1024 * 1024)]);
    await vi.waitFor(() => expect(q('.rte-mp-queue .is-failed')).not.toBeNull());
    expect(q('.rte-mp-tile-status').textContent).toMatch(/big\.png is 50 MB\. The limit is 10 MB/);
    expect(q('.rte-mp-tile-actions button[aria-label^="Retry"]')).toBeNull();
    expect(q('.rte-mp-tile-actions button[aria-label^="Remove"]')).not.toBeNull();
  });

  it('cancels one upload from its tile', async () => {
    let signal!: AbortSignal;
    open({ name: 'p', upload: (_f, ctx) => ((signal = ctx.signal!), new Promise(() => {})) });
    choose([file()]);
    q<HTMLButtonElement>('.rte-mp-tile-actions button[aria-label^="Cancel upload"]').click();
    expect(signal.aborted).toBe(true);
    expect(q('.rte-mp-queue .rte-mp-tile')).toBeNull();
  });

  it('cancels what is still going when the dialog is closed', () => {
    const signals: AbortSignal[] = [];
    open({ name: 'p', upload: (_f, ctx) => (signals.push(ctx.signal!), new Promise(() => {})) });
    choose([file('a.png'), file('b.png')]);
    q<HTMLButtonElement>('.cancel-btn').click();
    expect(signals).toHaveLength(2);
    expect(signals.every((s) => s.aborted)).toBe(true);
  });

  it('turns files dropped anywhere on the dialog into uploads, shown in the library grid while it is open', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    const dropped = file('dropped.png');
    const dt = { files: [dropped], types: ['Files'] };
    dialog().dispatchEvent(Object.assign(new Event('dragenter', { bubbles: true }), { dataTransfer: dt }));
    expect(dialog().classList.contains('is-dropping')).toBe(true);
    dialog().dispatchEvent(Object.assign(new Event('drop', { bubbles: true, cancelable: true }), { dataTransfer: dt }));
    expect(dialog().classList.contains('is-dropping')).toBe(false);
    expect(q('.tab-library').getAttribute('aria-selected')).toBe('true');
    await vi.waitFor(() => expect(q('.rte-mp-queue .is-selected')).not.toBeNull());
    await vi.waitFor(() => expect(tiles().some((t) => t.getAttribute('aria-label') === 'dropped.png')).toBe(true));
  });

  it('shows a file that is going up as a tile in the library grid, with its progress, and not as a choosable item', async () => {
    let finish!: (url: string) => void;
    const { provider } = makeProvider(2, {
      upload: (f: File, ctx: any) => new Promise((resolve) => { ctx.onProgress?.({ loaded: 1, total: 2, fraction: 0.5 }); finish = (url) => resolve(makeItem(77, { name: f.name, src: url })); }),
    });
    open(provider);
    await loaded();
    dialog().dispatchEvent(Object.assign(new Event('drop', { bubbles: true, cancelable: true }), { dataTransfer: { files: [file('up.png')], types: ['Files'] } }));
    const pending = () => dialog().querySelector('#rte-mp-panel-library [data-upload]');
    await vi.waitFor(() => expect(pending()).not.toBeNull());
    expect(pending()!.textContent).toContain('Uploading 50%');
    expect(pending()!.getAttribute('data-id')).toBeNull();
    finish('https://cdn.test/up.png');
    await vi.waitFor(() => expect(pending()).toBeNull());
    await vi.waitFor(() => expect(tiles().some((t) => t.getAttribute('aria-label') === 'up.png')).toBe(true));
  });

  it('turns a pasted image into an upload', async () => {
    open({ name: 'p', upload: async (f) => makeItem(1, { name: f.name, src: 'https://cdn.test/pasted.png' }) });
    dialog().dispatchEvent(Object.assign(new Event('paste', { bubbles: true, cancelable: true }), { clipboardData: { files: [file('pasted.png')] } }));
    await vi.waitFor(() => expect(q('.rte-mp-queue .is-selected')).not.toBeNull());
  });

  it('puts a finished upload at the top of the library without asking again', async () => {
    const { provider, list } = makeProvider(2);
    open(provider);
    await loaded();
    q<HTMLButtonElement>('.tab-upload').click();
    choose([file('new.png')]);
    await vi.waitFor(() => expect(q('.rte-mp-queue .is-selected')).not.toBeNull());
    q<HTMLButtonElement>('.tab-library').click();
    // The new file is put at the top without asking the server again.
    await vi.waitFor(() => expect(tiles().some((t) => t.getAttribute('aria-label') === 'new.png')).toBe(true));
    expect(list).toHaveBeenCalledTimes(1);
  });
});

describe('inserting from an address', () => {
  const type = (id: string, value: string) => {
    const input = q<HTMLInputElement>(`#${id}`);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  it('treats an address ending in a video extension as a video', () => {
    open(undefined);
    q<HTMLButtonElement>('.tab-url').click();
    type('url-input', 'https://example.com/clip.mp4');
    insertButton().click();
    expect(editor.querySelector('video')!.getAttribute('src')).toBe('https://example.com/clip.mp4');
  });

  it('inserts with Enter in the address field, with its alt text and size', () => {
    open(undefined);
    q<HTMLButtonElement>('.tab-url').click();
    type('url-input', 'https://example.com/a.png');
    type('alt-input', 'An A');
    type('width-input', '320');
    key(q('#url-input'), 'Enter');
    const img = editor.querySelector('img')!;
    expect(img.getAttribute('alt')).toBe('An A');
    expect(img.getAttribute('width')).toBe('320');
    expect(img.style.width).toBe('320px');
  });

  it('has nothing to insert, and no details panel, while the field is empty', () => {
    open(undefined);
    q<HTMLButtonElement>('.tab-url').click();
    expect(insertButton().disabled).toBe(true);
    expect(dialog().classList.contains('no-details')).toBe(true);
  });
});

describe('replacing an image', () => {
  const makeImage = () => {
    editor.insertAdjacentHTML('beforeend', '<img id="target" src="https://cdn.test/old.png" alt="Old description">');
    return document.getElementById('target') as HTMLImageElement;
  };

  it('takes one item, and puts it in the image, keeping the alt text when the new file has none', async () => {
    const img = makeImage();
    const { provider } = makeProvider();
    const { showReplaceImageDialog } = await import('../ui/replaceDialog');
    const changed = vi.fn();
    showReplaceImageDialog(img, { provider }, changed);

    expect(q('.rte-media-title').textContent).toBe('Replace Image');
    expect(q('#file-input').hasAttribute('multiple')).toBe(false);
    await loaded();
    expect(q('[role="listbox"]').hasAttribute('aria-multiselectable')).toBe(false);
    click(tiles()[0]);
    click(tiles()[1]);
    expect(tiles().filter((t) => t.getAttribute('aria-selected') === 'true')).toHaveLength(1);
    expect(insertButton().textContent).toBe('Replace');
    expect(q<HTMLTextAreaElement>('#detail-alt').value).toBe('Old description');
    insertButton().click();

    expect(img.getAttribute('src')).toBe('https://cdn.test/2.jpg');
    expect(img.alt).toBe('Old description');
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('starts from the current address when there is no library', async () => {
    const img = makeImage();
    const { showReplaceImageDialog } = await import('../ui/replaceDialog');
    showReplaceImageDialog(img);
    expect(q('.tab-url').getAttribute('aria-selected')).toBe('true');
    expect(q<HTMLInputElement>('#url-input').value).toBe('https://cdn.test/old.png');
    expect(insertButton().disabled).toBe(false);
  });
});

describe('the dialog itself', () => {
  it('names its tabs, panels and live regions for assistive technology', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    expect(q('.rte-mp-nav').getAttribute('role')).toBe('tablist');
    dialog().querySelectorAll('.rte-mp-nav-item').forEach((tab) => {
      expect(tab.getAttribute('role')).toBe('tab');
      expect(document.getElementById(tab.getAttribute('aria-controls')!)).not.toBeNull();
    });
    expect(q('.rte-mp-sr').getAttribute('aria-live')).toBe('polite');
    expect(q('#mp-search').getAttribute('aria-label')).toBeTruthy();
  });

  it('moves between the tabs with the arrow keys', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    q<HTMLButtonElement>('.tab-library').focus();
    key(q('.rte-mp-nav'), 'ArrowDown');
    expect(q('.tab-upload').getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(q('.tab-upload'));
    key(q('.rte-mp-nav'), 'ArrowUp');
    expect(q('.tab-library').getAttribute('aria-selected')).toBe('true');
  });

  it('closes with Escape and with the backdrop', () => {
    open(undefined);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('.rte-media-overlay')).toBeNull();
    open(undefined);
    document.querySelector<HTMLElement>('.rte-media-overlay')!.click();
    expect(document.querySelector('.rte-media-overlay')).toBeNull();
  });

  it('inserts nothing when cancelled', async () => {
    const { provider } = makeProvider();
    open(provider);
    await loaded();
    click(tiles()[0]);
    q<HTMLButtonElement>('.cancel-btn').click();
    expect(editor.querySelector('img')).toBeNull();
  });
});
