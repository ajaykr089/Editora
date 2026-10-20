import { beforeEach, describe, expect, it } from 'vitest';
import {
  adoptFigures,
  buildFigure,
  captionOf,
  ensureFigure,
  getAlign,
  setAlign,
  setWidth,
  toggleCaption,
} from '../model/figure';
import { insertBlocks } from '../ui/picker/insertMedia';

let host: HTMLElement;
const img = (extra = '') => `<img src="https://cdn.test/a.png" alt="A" ${extra}>`;
const setup = (html: string) => {
  document.body.innerHTML = `<div id="host" contenteditable="true">${html}</div>`;
  host = document.getElementById('host')!;
  return host.querySelector('img')!;
};

describe('the figure around media', () => {
  it('shrinks to the picture and carries the alignment as plain margins', () => {
    const media = document.createElement('img');
    media.src = 'https://cdn.test/a.png';
    const figure = buildFigure(media, 'center');
    expect(figure.className).toBe('rte-media');
    expect(figure.getAttribute('data-align')).toBe('center');
    expect(figure.style.display).toBe('table');
    expect(figure.style.margin).toBe('1em auto');
    expect(media.style.display).toBe('block');
  });

  it('is atomic while editing: the figure is not editable, its caption is', () => {
    const media = setup(`<figure class="rte-media">${img()}<figcaption>Hello</figcaption></figure>`);
    adoptFigures(host);
    expect(media.closest('figure')!.getAttribute('contenteditable')).toBe('false');
    expect(captionOf(media.closest('figure')!)!.getAttribute('contenteditable')).toBe('true');
    adoptFigures(host);
    expect(host.querySelectorAll('[contenteditable="false"]')).toHaveLength(1);
  });

  it('wraps a bare image in place, and moves a link that holds only the image inside with it', () => {
    const media = setup(`<p>Before</p><a href="https://example.com">${img('style="margin-left: auto; margin-right: auto; display: block;"')}</a><p>After</p>`);
    expect(getAlign(media)).toBe('center');
    const figure = ensureFigure(media);
    expect(figure.parentElement).toBe(host);
    expect(figure.querySelector('a > img')).toBe(media);
    expect(figure.getAttribute('data-align')).toBe('center');
    expect(media.style.marginLeft).toBe('');
    expect([...host.children].map((c) => c.tagName)).toEqual(['P', 'FIGURE', 'P']);
    expect(ensureFigure(media)).toBe(figure);
  });

  it('aligns left, centre and right, and reads the alignment back', () => {
    const media = setup(`<p>${img()}</p>`);
    setAlign(media, 'right');
    expect(getAlign(media)).toBe('right');
    expect(media.closest('figure')!.style.margin).toBe('1em 0px 1em auto');
    setAlign(media, 'left');
    expect(media.closest('figure')!.style.margin).toBe('1em auto 1em 0px');
    setAlign(media, 'center');
    expect(media.closest('figure')!.getAttribute('data-align')).toBe('center');
  });

  it('adds and removes a caption, which is a line of text under the picture', () => {
    const media = setup(`<p>${img()}</p>`);
    const caption = toggleCaption(media)!;
    expect(caption.tagName).toBe('FIGCAPTION');
    expect(caption.style.display).toBe('table-caption');
    expect(caption.getAttribute('contenteditable')).toBe('true');
    expect(media.closest('figure')!.querySelector('figcaption')).toBe(caption);
    expect(toggleCaption(media)).toBeNull();
    expect(media.closest('figure')!.querySelector('figcaption')).toBeNull();
  });

  it('sets a width and keeps the proportions', () => {
    const media = setup(`<p>${img()}</p>`);
    media.getBoundingClientRect = () => ({ width: 400, height: 200, left: 0, top: 0, right: 400, bottom: 200, x: 0, y: 0, toJSON() {} }) as DOMRect;
    setWidth(media, 100);
    expect(media.getAttribute('width')).toBe('100');
    expect(media.getAttribute('height')).toBe('50');
    expect(media.style.width).toBe('100px');
    setWidth(media, null);
    expect(media.hasAttribute('width')).toBe(false);
    expect(media.style.width).toBe('');
  });
});

describe('putting a figure at a caret', () => {
  const figureNode = () => {
    const media = document.createElement('img');
    media.src = 'https://cdn.test/new.png';
    return buildFigure(media);
  };
  const caretIn = (el: Element, offset: number) => {
    const range = document.createRange();
    range.setStart(el.firstChild!, offset);
    range.collapse(true);
    return range;
  };
  const tags = () => [...host.children].map((c) => c.tagName);

  it('splits the paragraph, because a figure may not sit inside one', () => {
    setup('<p>Alpha beta</p>');
    const tail = insertBlocks(caretIn(host.firstElementChild!, 6), host, [figureNode()]);
    expect(tags()).toEqual(['P', 'FIGURE', 'P']);
    expect(host.children[0].textContent).toBe('Alpha ');
    expect(host.children[2].textContent).toBe('beta');
    expect(tail).toBe(host.children[2]);
  });

  it('keeps a heading a heading on both sides', () => {
    setup('<h2>Title here</h2>');
    insertBlocks(caretIn(host.firstElementChild!, 5), host, [figureNode()]);
    expect(tags()).toEqual(['H2', 'FIGURE', 'H2']);
  });

  it('puts it before everything at the start of a paragraph, leaving no empty paragraph before it', () => {
    setup('<p>Alpha</p>');
    insertBlocks(caretIn(host.firstElementChild!, 0), host, [figureNode()]);
    expect(tags()).toEqual(['FIGURE', 'P']);
    expect(host.lastElementChild!.textContent).toBe('Alpha');
  });

  it('leaves an empty paragraph to type in after it at the end of one', () => {
    setup('<p>Alpha</p>');
    insertBlocks(caretIn(host.firstElementChild!, 5), host, [figureNode()]);
    expect(tags()).toEqual(['P', 'FIGURE', 'P']);
    expect(host.lastElementChild!.innerHTML).toBe('<br>');
  });

  it('replaces an empty paragraph', () => {
    setup('<p>One</p><p><br></p><p>Two</p>');
    const range = document.createRange();
    range.setStart(host.children[1], 0);
    range.collapse(true);
    insertBlocks(range, host, [figureNode()]);
    expect(tags()).toEqual(['P', 'FIGURE', 'P', 'P']);
    expect(host.children[0].textContent).toBe('One');
    expect(host.children[3].textContent).toBe('Two');
  });

  it('puts several in order, as a run', () => {
    setup('<p>Alpha beta</p>');
    const a = figureNode();
    const b = figureNode();
    insertBlocks(caretIn(host.firstElementChild!, 6), host, [a, b]);
    expect(tags()).toEqual(['P', 'FIGURE', 'FIGURE', 'P']);
    expect(host.children[1]).toBe(a);
  });

  it('replaces a selection rather than keeping it', () => {
    setup('<p>Alpha beta gamma</p>');
    const range = document.createRange();
    range.setStart(host.firstElementChild!.firstChild!, 5);
    range.setEnd(host.firstElementChild!.firstChild!, 11);
    insertBlocks(range, host, [figureNode()]);
    expect(host.children[0].textContent).toBe('Alpha');
    expect(host.children[2].textContent).toBe('gamma');
  });

  it('stays inside a list item, where a figure is allowed', () => {
    setup('<ul><li>Alpha beta</li></ul>');
    insertBlocks(caretIn(host.querySelector('li')!, 6), host, [figureNode()]);
    expect(host.querySelector('li > figure')).not.toBeNull();
    expect(host.querySelectorAll('li')).toHaveLength(1);
  });

  it('adds a paragraph after media that ends the editor, when the caret was not in a paragraph', () => {
    setup('');
    const range = document.createRange();
    range.selectNodeContents(host);
    range.collapse(false);
    const tail = insertBlocks(range, host, [figureNode()]);
    expect(tags()).toEqual(['FIGURE', 'P']);
    expect(tail).toBe(host.lastElementChild);
  });
});
