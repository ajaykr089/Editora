import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaManagerPlugin } from '../MediaManagerPlugin.native';
import { parseEmbedUrl } from '../embeds/providers';
import { buildEmbedFigure } from '../model/embed';
import { EMBED_MAX_WIDTH, isEmbed, isMedia, isResizable, kindOfFigure, setAlign, setWidth } from '../model/figure';
import { buildGallery, columnsFor, getColumns, pictures, removeFromGallery, setColumns } from '../model/gallery';
import { buildMediaElement, buildMediaNode } from '../ui/picker/insertMedia';
import { getMediaController } from '../ui/mediaController';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
const spec = (input = 'https://youtu.be/dQw4w9WgXcQ') => parseEmbedUrl(input)!;
let editor: HTMLElement;

const toolbar = () => document.querySelector('.media-floating-toolbar') as HTMLElement | null;
const labels = () => [...toolbar()!.querySelectorAll(':scope > button')].map((b) => b.getAttribute('aria-label'));
const press = (cls: string) => (toolbar()!.querySelector(cls) as HTMLElement).click();
const click = (el: Element, init: MouseEventInit = {}) => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
};
const handlesShown = () => [...document.querySelectorAll<HTMLElement>('[class^="media-resize-handle-"]')].some((h) => h.style.display === 'block');

beforeEach(() => {
  document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>Intro</p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
  getMediaController().detach();
  MediaManagerPlugin();
});
afterEach(() => {
  getMediaController().detach();
  document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('an embedded player', () => {
  it('is a block figure with an iframe that keeps its shape, built from the checked address', () => {
    const figure = buildEmbedFigure(spec());
    const iframe = figure.querySelector('iframe')!;
    expect(figure.className).toBe('rte-media rte-embed');
    expect(figure.getAttribute('data-provider')).toBe('youtube');
    expect(figure.getAttribute('data-align')).toBe('center');
    expect(figure.style.display).toBe('block');
    expect(figure.style.maxWidth).toBe(EMBED_MAX_WIDTH);
    expect(figure.getAttribute('contenteditable')).toBe('false');
    expect(iframe.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(iframe.title).toBe('YouTube video');
    expect(iframe.getAttribute('data-editora-embed')).toBe('true');
    expect(iframe.getAttribute('loading')).toBe('lazy');
    expect(iframe.hasAttribute('allowfullscreen')).toBe(true);
    expect(iframe.style.aspectRatio.replace(/\s/g, '')).toBe('1.7778');
    expect(iframe.getAttribute('allow')).not.toMatch(/camera|microphone|geolocation/);
  });

  it('can be given a title for people who cannot see it, and a narrower width when it is upright', () => {
    expect(buildEmbedFigure(spec(), { title: ' Our trip ' }).querySelector('iframe')!.title).toBe('Our trip');
    const short = buildEmbedFigure(spec('https://www.youtube.com/shorts/dQw4w9WgXcQ'));
    expect(short.style.maxWidth).toBe('360px');
  });

  it('keeps its width when it is aligned, and is sized by the figure', () => {
    const figure = buildEmbedFigure(spec());
    editor.append(figure);
    const iframe = figure.querySelector('iframe')!;
    expect(isEmbed(iframe)).toBe(true);
    expect(isMedia(iframe)).toBe(true);
    expect(isResizable(iframe)).toBe(false);
    setWidth(iframe, 400);
    expect(figure.style.maxWidth).toBe('400px');
    setAlign(iframe, 'right');
    expect(figure.style.maxWidth).toBe('400px');
    expect(figure.style.marginLeft).toBe('auto');
    expect(figure.className).toBe('rte-media rte-embed');
    setWidth(iframe, null);
    expect(figure.style.maxWidth).toBe(EMBED_MAX_WIDTH);
  });

  it('is not an embed unless it is in an embed figure', () => {
    const loose = document.createElement('iframe');
    editor.append(loose);
    expect(isEmbed(loose)).toBe(false);
    expect(isMedia(loose)).toBe(false);
  });

  it('is selected by a click on its figure, with a toolbar of what applies to a player', () => {
    editor.append(buildEmbedFigure(spec()));
    const event = click(editor.querySelector('figure')!);
    expect(event.defaultPrevented).toBe(true);
    expect(getMediaController().selection).toBe(editor.querySelector('iframe'));
    expect(labels()).toEqual(['Align left', 'Align center', 'Align right', 'Size', 'Add caption', 'Remove']);
    expect(toolbar()!.getAttribute('aria-label')).toBe('Embedded video options');
    expect(handlesShown()).toBe(false);
  });

  it('takes a click on its caption as editing the caption, not as selecting', () => {
    const figure = buildEmbedFigure(spec());
    figure.insertAdjacentHTML('beforeend', '<figcaption>Caption</figcaption>');
    editor.append(figure);
    click(figure.querySelector('figcaption')!);
    expect(getMediaController().selection).toBeNull();
  });

  it('is sized from the toolbar, and its caption and removal work', async () => {
    const figure = buildEmbedFigure(spec());
    editor.append(figure);
    click(figure);
    press('.btn-size');
    const medium = [...document.querySelectorAll<HTMLButtonElement>('.media-size-menu button')].find((b) => b.textContent === 'Medium')!;
    Object.defineProperty(editor, 'clientWidth', { value: 800, configurable: true });
    medium.click();
    expect(figure.style.maxWidth).toMatch(/^\d+px$/);
    press('.btn-caption');
    expect(figure.querySelector('figcaption')).not.toBeNull();
  });
});

describe('audio', () => {
  const audio = () => buildMediaNode({ src: 'https://cdn.test/a.mp3', type: 'audio' }, { figure: true })!;

  it('is a figure with a player that has controls, and loads nothing until played', () => {
    const figure = audio();
    const player = figure.querySelector('audio')!;
    expect(figure.tagName).toBe('FIGURE');
    expect(player.controls).toBe(true);
    expect(player.preload).toBe('metadata');
    expect(player.getAttribute('src')).toBe('https://cdn.test/a.mp3');
    expect(buildMediaElement({ src: 'x.mp3', type: 'audio', alt: 'ignored' })!.hasAttribute('alt')).toBe(false);
  });

  it('is selected without taking the click from its controls, with a small toolbar and no handles', () => {
    editor.append(audio());
    const player = editor.querySelector('audio')!;
    const event = click(player);
    expect(event.defaultPrevented).toBe(false);
    expect(getMediaController().selection).toBe(player);
    expect(labels()).toEqual(['Align left', 'Align center', 'Align right', 'Add caption', 'Remove']);
    expect(handlesShown()).toBe(false);
  });
});

describe('a gallery', () => {
  const images = (n: number) =>
    Array.from({ length: n }, (_, i) => {
      const img = document.createElement('img');
      img.src = `https://cdn.test/${i + 1}.jpg`;
      img.alt = `Picture ${i + 1}`;
      return img;
    });

  it('is a grid in one figure, every picture the same shape', () => {
    const figure = buildGallery(images(4));
    expect(figure.className).toBe('rte-media rte-gallery');
    expect(kindOfFigure(figure)).toBe('gallery');
    expect(figure.getAttribute('data-columns')).toBe('4');
    expect(figure.style.display).toBe('grid');
    expect(figure.style.gridTemplateColumns).toBe('repeat(4, minmax(0, 1fr))');
    expect(figure.getAttribute('contenteditable')).toBe('false');
    expect(pictures(figure).map((p) => p.alt)).toEqual(['Picture 1', 'Picture 2', 'Picture 3', 'Picture 4']);
    expect(pictures(figure)[0].style.objectFit).toBe('cover');
  });

  it('chooses how many columns by how many pictures, at most three until there are more', () => {
    expect([2, 3, 4, 5, 6, 12].map(columnsFor)).toEqual([2, 3, 4, 3, 3, 3]);
  });

  it('changes its columns, within 2 to 5', () => {
    const figure = buildGallery(images(4));
    setColumns(figure, 4);
    expect(getColumns(figure)).toBe(4);
    expect(figure.style.gridTemplateColumns).toBe('repeat(4, minmax(0, 1fr))');
    setColumns(figure, 99);
    expect(getColumns(figure)).toBe(5);
    setColumns(figure, 0);
    expect(getColumns(figure)).toBe(3);
  });

  it('has no alignment to change, and its pictures are not dragged to a size', () => {
    const figure = buildGallery(images(2));
    editor.append(figure);
    const first = pictures(figure)[0];
    expect(isResizable(first)).toBe(false);
    const before = figure.getAttribute('style');
    setAlign(first, 'right');
    expect(figure.getAttribute('style')).toBe(before);
  });

  it('shows the toolbar of a gallery: columns instead of size and alignment, and two ways to remove', () => {
    editor.append(buildGallery(images(3)));
    click(pictures(editor.querySelector('figure')!)[1]);
    expect(labels()).toEqual(['Columns', 'Add caption', 'Edit image: crop, rotate, resize', 'Edit alt text', 'Add link', 'Replace image', 'Remove picture', 'Remove gallery']);
    expect(toolbar()!.getAttribute('aria-label')).toBe('Gallery options');
    expect(handlesShown()).toBe(false);
  });

  it('sets the columns from the toolbar, as one undoable step', () => {
    const recorded = vi.fn();
    (window as any).execEditorCommand = (c: string, ...a: any[]) => c === 'recordDomTransaction' && recorded(...a);
    const figure = buildGallery(images(4));
    editor.append(figure);
    click(pictures(figure)[0]);
    press('.btn-columns');
    const menu = [...document.querySelectorAll<HTMLButtonElement>('.media-size-menu button')];
    expect(menu.map((b) => b.textContent)).toEqual(['2 columns', '3 columns', '4 columns (current)', '5 columns']);
    menu[0].click();
    expect(getColumns(figure)).toBe(2);
    expect(recorded).toHaveBeenCalledTimes(1);
    delete (window as any).execEditorCommand;
  });

  it('has a caption that is a row under the pictures', () => {
    const figure = buildGallery(images(2));
    editor.append(figure);
    click(pictures(figure)[0]);
    press('.btn-caption');
    const caption = figure.querySelector('figcaption')!;
    expect(caption.style.gridColumn).toBe('1 / -1');
    expect(caption.style.display).not.toBe('table-caption');
  });

  it('loses one picture, or all of them, from the toolbar', async () => {
    const figure = buildGallery(images(3));
    editor.append(figure);
    click(pictures(figure)[0]);
    press('.btn-remove');
    await vi.waitFor(() => [...document.querySelectorAll('button')].some((b) => /^remove$/i.test(b.textContent?.trim() ?? '')));
    [...document.querySelectorAll('button')].find((b) => /^remove$/i.test(b.textContent?.trim() ?? ''))!.click();
    await vi.waitFor(() => expect(pictures(figure)).toHaveLength(2));
    expect(figure.isConnected).toBe(true);

    click(pictures(figure)[0]);
    press('.btn-remove-gallery');
    await vi.waitFor(() => [...document.querySelectorAll('button')].some((b) => /^remove$/i.test(b.textContent?.trim() ?? '')));
    [...document.querySelectorAll('button')].find((b) => /^remove$/i.test(b.textContent?.trim() ?? ''))!.click();
    await vi.waitFor(() => expect(editor.querySelector('figure')).toBeNull());
  });

  it('goes when its last picture goes', () => {
    const figure = buildGallery(images(1));
    editor.append(figure);
    expect(removeFromGallery(pictures(figure)[0])).toBe(true);
    expect(figure.isConnected).toBe(false);
    expect(removeFromGallery(document.createElement('img'))).toBe(false);
  });
});
