import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaManagerPlugin } from '../MediaManagerPlugin.native';
import { setMediaManagerConfig } from '../constants';
import { resetLocalLibrary } from '../providers';
import { photoToItem, creditFor, stockAsList } from '../ui/picker/stock';
import { showAltTextDialog } from '../ui/altTextDialog';
import { tidyAltText } from '../ui/suggestAlt';
import { getMediaController } from '../ui/mediaController';
import type { MediaItem, MediaManagerConfig, MediaProvider, StockPhoto, StockProvider } from '../types/media';

let editor: HTMLElement;

const photo = (n: number, extra: Partial<StockPhoto> = {}): StockPhoto => ({
  id: String(n),
  thumbnailUrl: `https://stock.test/${n}-t.jpg`,
  url: `https://stock.test/${n}.jpg`,
  width: 1600,
  height: 1000,
  description: `A photo of thing ${n}`,
  author: 'Ada Lovelace',
  sourceUrl: `https://stock.test/p/${n}`,
  ...extra,
});

const makeStock = (total = 30, extra: Partial<StockProvider> = {}) => {
  const search = vi.fn(async ({ search, page, limit }: { search: string; page: number; limit: number }) => {
    const all = Array.from({ length: total }, (_, i) => photo(i + 1)).filter((p) => !search || p.description!.includes(search));
    return { items: all.slice((page - 1) * limit, page * limit), total: all.length };
  });
  return { stock: { name: 'Unsplash', search, ...extra } as StockProvider, search };
};

const libraryItem = (n: number): MediaItem => ({
  id: `m${n}`,
  name: `photo-${n}.jpg`,
  type: 'image',
  src: `https://cdn.test/${n}.jpg`,
  thumbnailUrl: `https://cdn.test/${n}-t.jpg`,
  size: 1024,
  mime: 'image/jpeg',
  createdAt: 0,
  metadata: {},
});
const library = (): MediaProvider => ({
  name: 'lib',
  upload: async () => libraryItem(1),
  list: async () => ({ items: [1, 2, 3].map(libraryItem), total: 3 }),
});

const dialog = () => document.querySelector('.rte-media-dialog') as HTMLElement;
const q = <T extends HTMLElement = HTMLElement>(selector: string) => dialog().querySelector(selector) as T;
const tiles = () => [...dialog().querySelectorAll<HTMLElement>('.rte-mp-tile[data-id]')];
const insertButton = () => q<HTMLButtonElement>('#insert-btn');
const click = (el: Element, init: MouseEventInit = {}) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...init }));
const loaded = () => vi.waitFor(() => expect(tiles().length).toBeGreaterThan(0));
const type = (id: string, value: string) => {
  const input = q<HTMLInputElement>(`#${id}`);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

const open = (config: Partial<MediaManagerConfig> | undefined, command: 'insertImage' | 'insertVideo' | 'insertAudio' = 'insertImage') => {
  const range = document.createRange();
  range.setStart(editor.querySelector('p')!.firstChild!, 5);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
  (MediaManagerPlugin(config).commands as any)[command](undefined, { contentElement: editor });
};

beforeEach(() => {
  resetLocalLibrary();
  document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>Alpha beta gamma</p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
  getMediaController().detach();
});
afterEach(() => {
  getMediaController().detach();
  document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
  document.body.innerHTML = '';
  setMediaManagerConfig({ provider: undefined, stockProvider: undefined, generateAltText: undefined, embedProviders: undefined, audio: undefined });
  vi.useRealTimers();
});

describe('embedding a video', () => {
  it('is a source of every insert dialog, but not of replacing a picture', async () => {
    for (const command of ['insertVideo', 'insertImage', 'insertAudio'] as const) {
      open(undefined, command);
      expect(q('.tab-embed')).not.toBeNull();
      document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
    }
    const { showReplaceImageDialog } = await import('../ui/replaceDialog');
    const img = document.createElement('img');
    img.src = 'https://cdn.test/a.png';
    editor.append(img);
    showReplaceImageDialog(img);
    expect(q('.tab-embed')).toBeNull();
  });

  it('says whether the link can be embedded, and offers nothing to insert until it can', () => {
    open(undefined, 'insertVideo');
    q<HTMLButtonElement>('.tab-embed').click();
    expect(q('#embed-url').getAttribute('id')).toBe('embed-url');
    expect(insertButton().disabled).toBe(true);
    type('embed-url', 'https://example.com/clip.mp4');
    expect(q('.rte-mp-embed-status').textContent).toMatch(/isn't a link to a video/);
    expect(q('.rte-mp-embed-status').classList.contains('is-error')).toBe(true);
    expect(insertButton().disabled).toBe(true);
    type('embed-url', 'https://youtu.be/dQw4w9WgXcQ');
    expect(q('.rte-mp-embed-status').textContent).toBe('YouTube video found. It loads when you insert it.');
    expect(insertButton().disabled).toBe(false);
    expect(insertButton().textContent).toBe('Insert video');
    type('embed-url', '');
    expect(q('.rte-mp-embed-status').textContent).toBe('');
    expect(insertButton().disabled).toBe(true);
  });

  it('puts the player in as a figure, with its title, after the paragraph is split, and tells the sanitizer it is trusted', () => {
    const inputs: any[] = [];
    editor.addEventListener('input', (e) => inputs.push(e));
    open(undefined, 'insertVideo');
    q<HTMLButtonElement>('.tab-embed').click();
    type('embed-url', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m');
    type('embed-title', 'A music video');
    insertButton().click();

    const figure = editor.querySelector('figure.rte-embed')!;
    const iframe = figure.querySelector('iframe')!;
    expect(iframe.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=60');
    expect(iframe.title).toBe('A music video');
    expect([...editor.children].map((c) => c.tagName)).toEqual(['P', 'FIGURE', 'P']);
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toBeInstanceOf(CustomEvent);
    expect(inputs[0].detail).toEqual({ allowedTags: ['iframe'] });
  });

  it('inserts with Enter in the link field, and reads an iframe snippet', () => {
    open(undefined, 'insertVideo');
    q<HTMLButtonElement>('.tab-embed').click();
    type('embed-url', '<iframe src="https://player.vimeo.com/video/76979871?h=a1b2c3d4e5" onload="x()"></iframe>');
    q('#embed-url').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    const iframe = editor.querySelector('iframe')!;
    expect(iframe.getAttribute('src')).toBe('https://player.vimeo.com/video/76979871?dnt=1&h=a1b2c3d4e5');
    expect(iframe.hasAttribute('onload')).toBe(false);
  });

  it('takes providers that were added', () => {
    open(
      { embedProviders: [{ id: 'loom', label: 'Loom video', parse: (u) => (u.hostname === 'www.loom.com' ? { src: 'https://www.loom.com/embed/abc', id: 'abc' } : null) }] },
      'insertVideo',
    );
    q<HTMLButtonElement>('.tab-embed').click();
    type('embed-url', 'https://www.loom.com/share/abc');
    expect(q('.rte-mp-embed-status').textContent).toMatch(/Loom video found/);
  });
});

describe('audio', () => {
  it('has its own dialog, that accepts and names audio', () => {
    open(undefined, 'insertAudio');
    expect(dialog().getAttribute('aria-label')).toBe('Insert Audio');
    expect(q<HTMLInputElement>('#file-input').accept).toContain('audio/mpeg');
    expect(q('.rte-mp-chip[aria-pressed="true"]').textContent).toBe('Audio');
  });

  it('inserts from an address as a figure with an audio player', () => {
    open(undefined, 'insertAudio');
    q<HTMLButtonElement>('.tab-url').click();
    expect(q<HTMLInputElement>('#url-input').placeholder).toBe('https://example.com/clip.mp3');
    type('url-input', 'https://cdn.test/podcast.mp3');
    expect(insertButton().textContent).toBe('Insert audio file');
    insertButton().click();
    const player = editor.querySelector('figure.rte-media audio') as HTMLAudioElement;
    expect(player.getAttribute('src')).toBe('https://cdn.test/podcast.mp3');
    expect(player.controls).toBe(true);
  });

  it('is listed from a library as audio, with a player in the details', async () => {
    const item: MediaItem = { ...libraryItem(1), type: 'audio', mime: 'audio/mpeg', name: 'episode.mp3', src: 'https://cdn.test/e.mp3', thumbnailUrl: undefined };
    open({ provider: { name: 'lib', upload: async () => item, list: async () => ({ items: [item], total: 1 }) } }, 'insertAudio');
    await loaded();
    expect(tiles()[0].getAttribute('aria-label')).toBe('episode.mp3, audio');
    click(tiles()[0]);
    expect(q('.rte-mp-preview audio')).not.toBeNull();
    expect(q('#detail-alt')).toBeNull();
    insertButton().click();
    expect(editor.querySelector('audio')!.getAttribute('src')).toBe('https://cdn.test/e.mp3');
  });

  it('has a toolbar button only when asked for, which is how the existing toolbars stay as they were', () => {
    expect(MediaManagerPlugin().toolbar!.map((t) => t.command)).toEqual(['insertImage', 'insertVideo']);
    expect(MediaManagerPlugin({ audio: true }).toolbar!.map((t) => t.command)).toEqual(['insertImage', 'insertVideo', 'insertAudio']);
    expect(typeof MediaManagerPlugin().commands!.insertAudio).toBe('function');
  });
});

describe('inserting several pictures as a gallery', () => {
  it('offers it for two or more pictures, and only for pictures', async () => {
    open({ provider: library() });
    await loaded();
    expect(q('.gallery-btn').hidden).toBe(true);
    click(tiles()[0]);
    expect(q('.gallery-btn').hidden).toBe(true);
    click(tiles()[1]);
    expect(q('.gallery-btn').hidden).toBe(false);
    click(tiles()[1]);
    expect(q('.gallery-btn').hidden).toBe(true);
    document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());

    open({ provider: { ...library(), list: async () => ({ items: [1, 2].map((n) => ({ ...libraryItem(n), type: 'video' as const })), total: 2 }) } }, 'insertVideo');
    await loaded();
    click(tiles()[0]);
    click(tiles()[1]);
    expect(q('.gallery-btn').hidden).toBe(true);
  });

  it('puts the chosen pictures in one gallery, in order, with their alt text, as one step', async () => {
    const recorded = vi.fn();
    (window as any).execEditorCommand = (c: string, ...a: any[]) => c === 'recordDomTransaction' && recorded(...a);
    open({ provider: library() });
    await loaded();
    click(tiles()[2]);
    click(tiles()[0]);
    const alt = q<HTMLTextAreaElement>('#detail-alt');
    alt.value = 'First';
    alt.dispatchEvent(new Event('input', { bubbles: true }));
    q<HTMLButtonElement>('.gallery-btn').click();

    const gallery = editor.querySelector('figure.rte-gallery')!;
    expect(gallery.querySelectorAll('img')).toHaveLength(2);
    expect([...gallery.querySelectorAll('img')].map((i) => i.getAttribute('src'))).toEqual(['https://cdn.test/3.jpg', 'https://cdn.test/1.jpg']);
    expect(gallery.querySelectorAll('img')[1].getAttribute('alt')).toBe('First');
    expect(gallery.getAttribute('data-columns')).toBe('2');
    expect(recorded).toHaveBeenCalledTimes(1);
    delete (window as any).execEditorCommand;
  });

  it('keeps the photo credits of a gallery of stock photos as its caption, once each', async () => {
    const authors = ['Ada Lovelace', 'Grace Hopper', 'Ada Lovelace', 'Ada Lovelace'];
    const stock: StockProvider = { name: 'Unsplash', search: async () => ({ items: authors.map((author, i) => photo(i + 1, { author })), total: 4 }) };
    open({ stockProvider: stock });
    await loaded();
    click(tiles()[0]);
    click(tiles()[3]);
    click(tiles()[1]);
    q<HTMLButtonElement>('.gallery-btn').click();
    // Photos 1 and 4 are by the same author as each other; 2 by another: two credits, not three.
    expect(editor.querySelector('figure.rte-gallery figcaption')!.textContent).toBe('Photo by Ada Lovelace on Unsplash · Photo by Grace Hopper on Unsplash');
  });

  it('is inserted as separate pictures when figures are switched off', async () => {
    open({ provider: library(), wrapInFigure: false });
    await loaded();
    click(tiles()[0]);
    click(tiles()[1]);
    q<HTMLButtonElement>('.gallery-btn').click();
    expect(editor.querySelector('.rte-gallery')).toBeNull();
    expect(editor.querySelectorAll('img')).toHaveLength(2);
  });
});

describe('stock photos', () => {
  it('is a Stock photos source of the insert dialogs, searched by the name of the service, and only when there is one', () => {
    const { stock } = makeStock();
    open({ stockProvider: stock });
    expect(q('.tab-stock span').textContent).toBe('Stock photos');
    q<HTMLButtonElement>('.tab-stock').click();
    expect((q('#mp-search') as HTMLInputElement).placeholder).toBe('Search Unsplash');
    document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
    open({ stockProvider: stock }, 'insertVideo');
    expect(q('.tab-stock')).not.toBeNull();
    document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
    open(undefined);
    expect(q('.tab-stock')).toBeNull();
  });

  it('shows what the service offers for an empty search, paged', async () => {
    const { stock, search } = makeStock(30);
    open({ stockProvider: stock });
    expect(q('.tab-stock').getAttribute('aria-selected')).toBe('true');
    await loaded();
    expect(search.mock.calls[0][0]).toEqual({ search: '', page: 1, limit: 24 });
    expect(tiles()).toHaveLength(24);
    expect(tiles()[0].querySelector('img')!.getAttribute('src')).toBe('https://stock.test/1-t.jpg');
    q<HTMLButtonElement>('.rte-mp-more').click();
    await vi.waitFor(() => expect(tiles()).toHaveLength(30));
    expect(search.mock.calls[1][0]).toMatchObject({ page: 2 });
  });

  it('searches the service, and keeps each tab\'s own search', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { stock, search } = makeStock(30);
    open({ stockProvider: stock, provider: library() });
    await loaded();
    const input = q<HTMLInputElement>('#mp-search');
    expect(input.getAttribute('aria-label')).toBe('Search the library');
    q<HTMLButtonElement>('.tab-stock').click();
    expect(input.getAttribute('aria-label')).toBe('Search Unsplash');
    input.value = 'thing 12';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(350);
    await vi.waitFor(() => expect(search).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'thing 12' }), expect.anything()));
    q<HTMLButtonElement>('.tab-library').click();
    expect(input.value).toBe('');
    q<HTMLButtonElement>('.tab-stock').click();
    expect(input.value).toBe('thing 12');
  });

  it('inserts the photo from the service, with its description as alt text and a credit as its caption', async () => {
    const { stock } = makeStock();
    open({ stockProvider: stock });
    await loaded();
    click(tiles()[0]);
    expect(q<HTMLTextAreaElement>('#detail-alt').value).toBe('A photo of thing 1');
    expect([...q('.rte-mp-details').querySelectorAll('button')].some((b) => /Delete/.test(b.textContent ?? ''))).toBe(false);
    insertButton().click();
    const figure = editor.querySelector('figure')!;
    expect(figure.querySelector('img')!.getAttribute('src')).toBe('https://stock.test/1.jpg');
    expect(figure.querySelector('img')!.getAttribute('alt')).toBe('A photo of thing 1');
    expect(figure.querySelector('figcaption')!.textContent).toBe('Photo by Ada Lovelace on Unsplash');
  });

  it('can credit differently, or not at all', () => {
    const { stock } = makeStock();
    expect(creditFor(stock, photo(1))).toBe('Photo by Ada Lovelace on Unsplash');
    expect(creditFor(stock, photo(1, { author: undefined }))).toBeNull();
    expect(creditFor({ ...stock, caption: false }, photo(1))).toBeNull();
    expect(creditFor({ ...stock, caption: (p) => `© ${p.author}` }, photo(1))).toBe('© Ada Lovelace');
    expect(creditFor({ ...stock, caption: () => '  ' }, photo(1))).toBeNull();
  });

  it('turns a photo into an item, and a service that does not say how many there are into a list that goes on while pages are full', async () => {
    const { stock } = makeStock();
    expect(photoToItem(stock, photo(7))).toMatchObject({ id: 'stock-7', type: 'image', src: 'https://stock.test/7.jpg', alt: 'A photo of thing 7', metadata: { stock: true } });
    const noTotal: StockProvider = { name: 'X', search: async ({ page }) => ({ items: Array.from({ length: page === 1 ? 24 : 5 }, (_, i) => photo(i + 1)) }) };
    const list = stockAsList(noTotal).list!;
    expect((await list({ page: 1, limit: 24 })).total).toBe(25);
    expect((await list({ page: 2, limit: 24 })).total).toBe(29);
  });

  it('says so when the service fails, and tries again', async () => {
    let fail = true;
    const stock: StockProvider = {
      name: 'Unsplash',
      search: async () => {
        if (fail) throw new Error('The photo service is down.');
        return { items: [photo(1)], total: 1 };
      },
    };
    open({ stockProvider: stock });
    await vi.waitFor(() => expect(q('.rte-mp-error')).not.toBeNull());
    expect(q('.rte-mp-error strong').textContent).toBe('The photo service is down.');
    fail = false;
    q<HTMLButtonElement>('.rte-mp-error button').click();
    await vi.waitFor(() => expect(tiles()).toHaveLength(1));
  });
});

describe('suggesting alt text', () => {
  const generate = (impl: MediaManagerConfig['generateAltText']) => vi.fn(impl!);

  it('has no button unless a function was given', async () => {
    open({ provider: library() });
    await loaded();
    click(tiles()[0]);
    expect(q('.rte-mp-suggest')).toBeNull();
  });

  it('asks for the picture, fills the field for the person to read, and inserts nothing by itself', async () => {
    const fn = generate(async () => '  "A red barn at dusk."  ');
    open({ provider: library(), generateAltText: fn });
    await loaded();
    click(tiles()[0]);
    const decorative = q<HTMLInputElement>('#detail-decorative');
    decorative.checked = true;
    decorative.dispatchEvent(new Event('change', { bubbles: true }));

    const button = q<HTMLButtonElement>('.rte-mp-suggest');
    button.click();
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('Describing…');
    await vi.waitFor(() => expect(q<HTMLTextAreaElement>('#detail-alt').value).toBe('A red barn at dusk.'));
    expect(fn.mock.calls[0][0]).toEqual({ src: 'https://cdn.test/1.jpg', name: 'photo-1.jpg' });
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe('Alt');
    expect(decorative.checked).toBe(false);
    expect(q('.rte-mp-details .rte-mp-hint[role="status"]').textContent).toMatch(/Read it and change it/);
    expect(editor.querySelector('img')).toBeNull();
    insertButton().click();
    expect(editor.querySelector('img')!.getAttribute('alt')).toBe('A red barn at dusk.');
  });

  it('says what went wrong, and leaves the field alone', async () => {
    open({ provider: library(), generateAltText: generate(async () => { throw new Error('The description service is busy.'); }) });
    await loaded();
    click(tiles()[0]);
    const alt = q<HTMLTextAreaElement>('#detail-alt');
    alt.value = 'Mine';
    alt.dispatchEvent(new Event('input', { bubbles: true }));
    q<HTMLButtonElement>('.rte-mp-suggest').click();
    await vi.waitFor(() => expect(q('.rte-mp-details [role="alert"]')).not.toBeNull());
    expect(q('.rte-mp-details [role="alert"]').textContent).toBe('The description service is busy.');
    expect(alt.value).toBe('Mine');
    expect(q<HTMLButtonElement>('.rte-mp-suggest').disabled).toBe(false);
  });

  it('treats an empty answer as a failure', async () => {
    open({ provider: library(), generateAltText: generate(async () => '   ') });
    await loaded();
    click(tiles()[0]);
    q<HTMLButtonElement>('.rte-mp-suggest').click();
    await vi.waitFor(() => expect(q('.rte-mp-details [role="alert"]').textContent).toBe('No description came back.'));
  });

  it('is stopped when another picture is looked at, and does not fill that one', async () => {
    let signal!: AbortSignal;
    let finish!: (text: string) => void;
    open({ provider: library(), generateAltText: generate((_i, ctx) => ((signal = ctx.signal!), new Promise((resolve) => (finish = resolve)))) });
    await loaded();
    click(tiles()[0]);
    q<HTMLButtonElement>('.rte-mp-suggest').click();
    click(tiles()[1]);
    expect(signal.aborted).toBe(true);
    finish('Late answer');
    await Promise.resolve();
    expect(q<HTMLTextAreaElement>('#detail-alt').value).toBe('');
  });

  it('is stopped when the dialog is closed', async () => {
    let signal!: AbortSignal;
    open({ provider: library(), generateAltText: generate((_i, ctx) => ((signal = ctx.signal!), new Promise(() => {}))) });
    await loaded();
    click(tiles()[0]);
    q<HTMLButtonElement>('.rte-mp-suggest').click();
    q<HTMLButtonElement>('.cancel-btn').click();
    expect(signal.aborted).toBe(true);
  });

  it('is in the alt text dialog of an image in the document too', async () => {
    const img = document.createElement('img');
    img.src = 'https://cdn.test/x.jpg';
    editor.append(img);
    const fn = generate(async () => 'A cat on a sofa');
    showAltTextDialog(img, undefined, { generateAltText: fn });
    const field = q<HTMLTextAreaElement>('#alt-text-input');
    q<HTMLButtonElement>('.rte-mp-suggest').click();
    await vi.waitFor(() => expect(field.value).toBe('A cat on a sofa'));
    expect(fn.mock.calls[0][0]).toEqual({ src: 'https://cdn.test/x.jpg' });
    q<HTMLButtonElement>('.save-btn').click();
    expect(img.alt).toBe('A cat on a sofa');
  });

  it('is not in the alt text dialog without a function', () => {
    const img = document.createElement('img');
    editor.append(img);
    showAltTextDialog(img);
    expect(q('.rte-mp-suggest')).toBeNull();
  });

  it('tidies what comes back', () => {
    expect(tidyAltText('  “A\n  dog.”  ')).toBe('A dog.');
    expect(tidyAltText(undefined)).toBe('');
    expect(tidyAltText('x'.repeat(600)).length).toBe(498);
  });
});
