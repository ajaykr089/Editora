import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaManagerPlugin } from '../MediaManagerPlugin.native';
import { getMediaController } from '../ui/mediaController';
import type { MediaManagerConfig } from '../types/media';

const notifyMock = vi.hoisted(() => vi.fn());
vi.mock('../../../shared/notify', () => ({ notify: notifyMock }));

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
let editor: HTMLElement;

const toolbar = () => document.querySelector('.media-floating-toolbar') as HTMLElement | null;
const press = (cls: string) => (toolbar()!.querySelector(cls) as HTMLElement).click();
const click = (el: Element, init: MouseEventInit = {}) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...init }));
const keydown = (el: Element | Document, key: string, init: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
};
const selectNode = (node: Node) => {
  const range = document.createRange();
  range.selectNode(node);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));
};
const caretIn = (node: Node, offset: number) => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));
};
const make = (config?: Partial<MediaManagerConfig>) => MediaManagerPlugin(config);

beforeEach(() => {
  document.body.innerHTML = `<div class="rte-content" contenteditable="true"><p>Alpha beta</p><p><img src="${PIXEL}" alt="a"></p></div>`;
  editor = document.querySelector('.rte-content') as HTMLElement;
  getMediaController().detach();
  notifyMock.mockClear();
});
afterEach(() => {
  getMediaController().detach();
  document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
  document.body.innerHTML = '';
  delete (window as any).execEditorCommand;
  delete (document as any).execCommand;
});

describe('selecting media from the keyboard', () => {
  it('selects media when it becomes a node selection, as it does for Shift+Arrow and for a click', () => {
    make();
    selectNode(editor.querySelector('img')!);
    expect(getMediaController().selection).toBe(editor.querySelector('img'));
    expect(toolbar()).not.toBeNull();
  });

  it('selects the media of a figure that is selected as a node', () => {
    make();
    editor.insertAdjacentHTML('beforeend', `<figure class="rte-media"><img id="f" src="${PIXEL}"></figure>`);
    selectNode(editor.querySelector('figure')!);
    expect(getMediaController().selection).toBe(document.getElementById('f'));
  });

  it('lets go when the caret goes to the text, but not while the selection is in the toolbar or a dialog', () => {
    make();
    selectNode(editor.querySelector('img')!);
    caretIn(document.body, 0); // outside the editor: the toolbar or a dialog has the focus
    expect(getMediaController().selection).not.toBeNull();
    caretIn(editor.querySelector('p')!.firstChild!, 2);
    expect(getMediaController().selection).toBeNull();
    expect(toolbar()).toBeNull();
  });

  it('lets go of media that was deleted', () => {
    make();
    selectNode(editor.querySelector('img')!);
    editor.querySelector('img')!.remove();
    document.dispatchEvent(new Event('selectionchange'));
    expect(getMediaController().selection).toBeNull();
  });

  it('opens the toolbar with Alt+F10, moves along it with the arrow keys, and leaves with Escape, keeping the media selected', () => {
    make();
    selectNode(editor.querySelector('img')!);
    const event = keydown(editor, 'F10', { altKey: true });
    expect(event.defaultPrevented).toBe(true);
    const buttons = [...toolbar()!.querySelectorAll<HTMLButtonElement>(':scope > .media-floating-toolbar-btn')];
    expect(document.activeElement).toBe(buttons[0]);
    expect(buttons.filter((b) => b.tabIndex === 0)).toEqual([buttons[0]]);

    keydown(buttons[0], 'ArrowRight');
    expect(document.activeElement).toBe(buttons[1]);
    expect(buttons[1].tabIndex).toBe(0);
    expect(buttons[0].tabIndex).toBe(-1);
    keydown(buttons[1], 'End');
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);
    keydown(buttons[buttons.length - 1], 'ArrowRight');
    expect(document.activeElement).toBe(buttons[0]);

    keydown(buttons[0], 'Escape');
    expect(document.activeElement).toBe(editor);
    expect(getMediaController().selection).not.toBeNull();
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.endOffset - range.startOffset).toBe(1);
  });

  it('keeps the focus on the same button after using it, although the toolbar is rebuilt to show the new state', () => {
    make();
    selectNode(editor.querySelector('img')!);
    keydown(editor, 'F10', { altKey: true });
    keydown(document.activeElement!, 'ArrowRight');
    (document.activeElement as HTMLElement).click();
    expect(toolbar()!.querySelector('.btn-align-center')!.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(toolbar()!.querySelector('.btn-align-center'));
    expect((document.activeElement as HTMLElement).tabIndex).toBe(0);
  });

  it('leaves the toolbar for the text on Tab, so that it is one stop and not a trap', () => {
    make();
    selectNode(editor.querySelector('img')!);
    keydown(editor, 'F10', { altKey: true });
    const event = keydown(document.activeElement!, 'Tab');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(editor);
  });

  it('does not take clicks on the control bar of a video', () => {
    make();
    editor.insertAdjacentHTML('beforeend', '<video controls src="x.mp4"></video>');
    const video = editor.querySelector('video')!;
    Object.defineProperty(video, 'clientHeight', { value: 200 });
    const onBar = new MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(onBar, 'offsetY', { value: 190 });
    video.dispatchEvent(onBar);
    expect(getMediaController().selection).toBeNull();
    const onPicture = new MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(onPicture, 'offsetY', { value: 20 });
    video.dispatchEvent(onPicture);
    expect(getMediaController().selection).toBe(video);
  });

  it('makes a loaded figure atomic once the editor is entered', () => {
    make();
    editor.insertAdjacentHTML('beforeend', `<figure class="rte-media"><img src="${PIXEL}"><figcaption>Hi</figcaption></figure>`);
    editor.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(editor.querySelector('figure')!.getAttribute('contenteditable')).toBe('false');
    expect(editor.querySelector('figcaption')!.getAttribute('contenteditable')).toBe('true');
  });
});

describe('arrow keys and media', () => {
  const setup = () => {
    editor.innerHTML = `<p>Before</p><figure class="rte-media"><img id="m" src="${PIXEL}"><figcaption>Cap</figcaption></figure><p>After</p>`;
    make();
    return { before: editor.children[0], figure: editor.children[1], after: editor.children[2] };
  };
  const selectedNode = () => {
    const r = window.getSelection()!.getRangeAt(0);
    return r.endOffset - r.startOffset === 1 ? r.startContainer.childNodes[r.startOffset] : null;
  };

  it('select the media from the end of the block before it, and carry on past it with the next press', () => {
    const { before, figure, after } = setup();
    caretIn(before.firstChild!, 6);
    const event = keydown(before.firstChild!.parentElement!, 'ArrowRight');
    expect(event.defaultPrevented).toBe(true);
    expect(selectedNode()).toBe(figure);
    expect(getMediaController().selection!.id).toBe('m');
    keydown(editor, 'ArrowRight');
    const caret = window.getSelection()!.getRangeAt(0);
    expect(caret.collapsed).toBe(true);
    expect(caret.startContainer).toBe(after.firstChild);
    expect(caret.startOffset).toBe(0);
  });

  it('select the media from the start of the block after it, going back', () => {
    const { before, figure, after } = setup();
    caretIn(after.firstChild!, 0);
    keydown(after, 'ArrowLeft');
    expect(selectedNode()).toBe(figure);
    keydown(editor, 'ArrowUp');
    const caret = window.getSelection()!.getRangeAt(0);
    expect(caret.startContainer).toBe(before.firstChild);
    expect(caret.startOffset).toBe(6);
  });

  it('leave the caret alone anywhere else in the text', () => {
    const { before } = setup();
    caretIn(before.firstChild!, 3);
    expect(keydown(before, 'ArrowRight').defaultPrevented).toBe(false);
    caretIn(before.firstChild!, 6);
    expect(keydown(before, 'ArrowLeft').defaultPrevented).toBe(false);
    expect(keydown(before, 'ArrowRight', { shiftKey: true }).defaultPrevented).toBe(false);
  });

  it('go back from the start of a caption to its media', () => {
    const { figure } = setup();
    const caption = figure.querySelector('figcaption')!;
    caretIn(caption.firstChild!, 0);
    expect(keydown(caption, 'ArrowUp').defaultPrevented).toBe(true);
    expect(selectedNode()).toBe(figure);
    caretIn(caption.firstChild!, 2);
    expect(keydown(caption, 'ArrowLeft').defaultPrevented).toBe(false);
  });

  it('do nothing for a figure that is still uploading', () => {
    editor.innerHTML = '<p>Before</p><figure class="rte-media" data-rte-media-pending="p1"></figure><p>After</p>';
    make();
    caretIn(editor.children[0].firstChild!, 6);
    expect(keydown(editor.children[0], 'ArrowRight').defaultPrevented).toBe(false);
  });
});

describe('captions', () => {
  const withCaption = () => {
    make();
    click(editor.querySelector('img')!);
    press('.btn-caption');
    return editor.querySelector('figcaption') as HTMLElement;
  };

  it('are added from the toolbar, which says so, and take the caret', () => {
    const caption = withCaption();
    expect(caption).not.toBeNull();
    expect(caption.closest('figure')).not.toBeNull();
    const selection = window.getSelection()!;
    expect(caption.contains(selection.anchorNode)).toBe(true);
    expect(toolbar()!.querySelector('.btn-caption')!.getAttribute('aria-pressed')).toBe('true');
    expect(toolbar()!.querySelector('.btn-caption')!.getAttribute('aria-label')).toBe('Remove caption');
  });

  it('keep the toolbar while the caret is in them', () => {
    const caption = withCaption();
    caption.textContent = 'A barn';
    caretIn(caption.firstChild!, 3);
    expect(getMediaController().selection).not.toBeNull();
  });

  it('end with Enter, which goes on in a new paragraph below the media and splits nothing', () => {
    const caption = withCaption();
    caption.textContent = 'A barn';
    const onInput = vi.fn();
    editor.addEventListener('input', onInput);
    const event = keydown(caption, 'Enter');
    expect(event.defaultPrevented).toBe(true);
    const figure = caption.closest('figure')!;
    expect(figure.nextElementSibling!.tagName).toBe('P');
    expect(caption.textContent).toBe('A barn');
    expect(window.getSelection()!.anchorNode).toBe(figure.nextElementSibling);
    expect(onInput).toHaveBeenCalled();
  });

  it('let Shift+Enter through', () => {
    const caption = withCaption();
    expect(keydown(caption, 'Enter', { shiftKey: true }).defaultPrevented).toBe(false);
  });

  it('are removed by Backspace when empty, which goes back to the media', () => {
    const caption = withCaption();
    const event = keydown(caption, 'Backspace');
    expect(event.defaultPrevented).toBe(true);
    expect(editor.querySelector('figcaption')).toBeNull();
    expect(getMediaController().selection).toBe(editor.querySelector('img'));
    expect(document.activeElement).toBe(editor);
  });

  it('keep what Backspace deletes when they hold text', () => {
    const caption = withCaption();
    caption.textContent = 'x';
    expect(keydown(caption, 'Backspace').defaultPrevented).toBe(false);
  });

  it('take pasted text as one plain line, whatever was copied', () => {
    const exec = vi.fn(() => true);
    (document as any).execCommand = exec;
    const caption = withCaption();
    const paste = Object.assign(new Event('paste', { bubbles: true, cancelable: true }), {
      clipboardData: { files: [], getData: (type: string) => (type === 'text/plain' ? 'Line one\n  line two' : '<b>x</b>') },
    });
    caption.dispatchEvent(paste);
    expect(paste.defaultPrevented).toBe(true);
    expect(exec).toHaveBeenCalledWith('insertText', false, 'Line one line two');
  });

  it('is the one thing a figure takes away when the media is removed', async () => {
    withCaption();
    press('.btn-remove');
    await vi.waitFor(() => [...document.querySelectorAll('button')].some((b) => /^remove$/i.test(b.textContent?.trim() ?? '')));
    [...document.querySelectorAll('button')].find((b) => /^remove$/i.test(b.textContent?.trim() ?? ''))!.click();
    await vi.waitFor(() => expect(editor.querySelector('figure')).toBeNull());
    expect(editor.querySelector('img')).toBeNull();
  });
});

describe('the size menu', () => {
  const open = () => {
    make();
    const img = editor.querySelector('img')!;
    Object.defineProperty(editor, 'clientWidth', { value: 640, configurable: true });
    img.getBoundingClientRect = () => ({ width: 200, height: 100, left: 0, top: 0, right: 200, bottom: 100, x: 0, y: 0, toJSON() {} }) as DOMRect;
    click(img);
    press('.btn-size');
    return img;
  };
  const choose = (label: string) =>
    [...document.querySelectorAll<HTMLButtonElement>('.media-size-menu button')].find((b) => b.textContent === label)!.click();

  it('opens as a menu, with its first item focused, and says so', () => {
    open();
    const menu = document.querySelector('.media-size-menu')!;
    expect(menu.getAttribute('role')).toBe('menu');
    expect([...menu.querySelectorAll('[role="menuitem"]')].map((i) => i.textContent)).toEqual(['Small', 'Medium', 'Large', 'Full width', 'Original size']);
    expect(toolbar()!.querySelector('.btn-size')!.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement!.textContent).toBe('Small');
  });

  it('sets the width to a share of the editor, as one undoable step', () => {
    const recorded = vi.fn();
    (window as any).execEditorCommand = (c: string, ...a: any[]) => c === 'recordDomTransaction' && recorded(...a);
    const img = open();
    choose('Medium');
    expect(img.getAttribute('width')).toBe('320');
    expect(img.getAttribute('height')).toBe('160');
    expect(recorded).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.media-size-menu')).toBeNull();
  });

  it('goes back to the original size', () => {
    const img = open();
    choose('Full width');
    expect(img.getAttribute('width')).toBe('640');
    press('.btn-size');
    choose('Original size');
    expect(img.hasAttribute('width')).toBe(false);
  });

  it('moves with the arrow keys and closes with Escape, returning to its button', () => {
    open();
    const menu = document.querySelector('.media-size-menu')!;
    keydown(menu.querySelector('button')!, 'ArrowDown');
    expect(document.activeElement!.textContent).toBe('Medium');
    keydown(document.activeElement!, 'ArrowUp');
    keydown(document.activeElement!, 'ArrowUp');
    expect(document.activeElement!.textContent).toBe('Original size');
    keydown(document.activeElement!, 'Escape');
    expect(document.querySelector('.media-size-menu')).toBeNull();
    expect(document.activeElement).toBe(toolbar()!.querySelector('.btn-size'));
  });
});

describe('alignment buttons', () => {
  it('say which alignment the media has', () => {
    make();
    click(editor.querySelector('img')!);
    press('.btn-align-center');
    const state = () => ['left', 'center', 'right'].map((a) => toolbar()!.querySelector(`.btn-align-${a}`)!.getAttribute('aria-pressed'));
    expect(state()).toEqual(['false', 'true', 'false']);
    press('.btn-align-right');
    expect(state()).toEqual(['false', 'false', 'true']);
  });
});

describe('pasting and dropping files', () => {
  const file = (name = 'shot.png', type = 'image/png') => new File(['x'], name, { type });
  const pasteOf = (files: File[], data: Record<string, string> = {}, target: Element = editor.querySelector('p')!) => {
    const event = Object.assign(new Event('paste', { bubbles: true, cancelable: true }), {
      clipboardData: { files, types: ['Files'], getData: (type: string) => data[type] ?? '' },
    });
    target.dispatchEvent(event);
    return event;
  };
  const caret = () => caretIn(editor.querySelector('p')!.firstChild!, 5);
  const layers = () => [...document.querySelectorAll<HTMLElement>('.rte-mp-pending')];
  const pending = () => [...editor.querySelectorAll('[data-rte-media-pending]')];

  it('puts a placeholder at the caret at once, with the progress drawn outside the document', async () => {
    let report!: (n: number) => void;
    let finish!: (url: string) => void;
    make({ uploadHandler: (_f, ctx) => new Promise((resolve) => { report = (f) => ctx.onProgress?.({ loaded: f, total: 1, fraction: f }); finish = resolve as any; }) });
    caret();
    const event = pasteOf([file()]);
    expect(event.defaultPrevented).toBe(true);

    expect(pending()).toHaveLength(1);
    expect([...editor.children].map((c) => c.tagName)).toEqual(['P', 'FIGURE', 'P', 'P']);
    expect(editor.contains(layers()[0])).toBe(false);
    expect(pending()[0].innerHTML).toBe('');
    report(0.4);
    expect(layers()[0].querySelector('.rte-mp-pending-label')!.textContent).toBe('Uploading 40%');
    expect(layers()[0].querySelector<HTMLElement>('.rte-mp-pending-bar > span')!.style.width).toBe('40%');
    expect(layers()[0].getAttribute('role')).toBe('status');

    finish('https://cdn.test/shot.png');
    await vi.waitFor(() => expect(pending()).toHaveLength(0));
    expect(layers()).toHaveLength(0);
    const img = editor.querySelector('figure img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('https://cdn.test/shot.png');
    expect(editor.querySelector('figure')!.getAttribute('data-align')).toBe('left');
  });

  it('records the finished upload as one undoable step that does not include the placeholder', async () => {
    const recorded = vi.fn();
    (window as any).execEditorCommand = (c: string, ...a: any[]) => c === 'recordDomTransaction' && recorded(...a);
    make({ uploadHandler: async () => 'https://cdn.test/shot.png' });
    caret();
    pasteOf([file()]);
    await vi.waitFor(() => expect(recorded).toHaveBeenCalledTimes(1));
    const [target, before, after] = recorded.mock.calls[0];
    expect(target).toBe(editor);
    expect(before).not.toContain('data-rte-media-pending');
    expect(before).not.toContain('<figure');
    expect(after).toContain('https://cdn.test/shot.png');
    expect(after).not.toContain('data-rte-media-pending');
  });

  it('removes the placeholder and says why when the upload fails', async () => {
    make({ uploadHandler: async () => { throw new Error('Storage is full.'); } });
    caret();
    pasteOf([file()]);
    await vi.waitFor(() => expect(pending()).toHaveLength(0));
    expect(layers()).toHaveLength(0);
    expect(notifyMock).toHaveBeenCalledWith('Storage is full.', 'error');
    expect(editor.querySelector('figure')).toBeNull();
  });

  it('cancels from the placeholder', () => {
    let signal!: AbortSignal;
    make({ uploadHandler: (_f, ctx) => ((signal = ctx.signal!), new Promise(() => {})) });
    caret();
    pasteOf([file()]);
    layers()[0].querySelector<HTMLButtonElement>('button')!.click();
    expect(signal.aborted).toBe(true);
    expect(pending()).toHaveLength(0);
    expect(layers()).toHaveLength(0);
  });

  it('refuses a file that is too large before inserting anything', () => {
    make({ uploadHandler: async () => 'x', maxFileSize: 1 });
    caret();
    const big = new File(['xx'], 'big.png', { type: 'image/png' });
    const event = pasteOf([big]);
    expect(event.defaultPrevented).toBe(true);
    expect(pending()).toHaveLength(0);
    expect(notifyMock).toHaveBeenCalledWith(expect.stringMatching(/big\.png/), 'error');
  });

  it('takes several files, each with its own placeholder, in order', async () => {
    make({ uploadHandler: async (f) => `https://cdn.test/${f.name}` });
    caret();
    pasteOf([file('a.png'), file('b.png')]);
    expect(pending()).toHaveLength(2);
    await vi.waitFor(() => expect(pending()).toHaveLength(0));
    expect([...editor.querySelectorAll('figure img')].map((i) => i.getAttribute('src'))).toEqual(['https://cdn.test/a.png', 'https://cdn.test/b.png']);
  });

  it('leaves a paste that is text alone, even when a picture of it comes along', () => {
    make({ uploadHandler: async () => 'x' });
    caret();
    expect(pasteOf([file()], { 'text/plain': 'A1\tB1' }).defaultPrevented).toBe(false);
    expect(pasteOf([file()], { 'text/html': '<table><tr><td>A1</td></tr></table>' }).defaultPrevented).toBe(false);
    expect(pasteOf([file()], { 'text/html': '<p>Some words</p>' }).defaultPrevented).toBe(false);
    expect(pending()).toHaveLength(0);
  });

  it('takes a copied image, whose clipboard has markup that is only the image', () => {
    make({ uploadHandler: async () => 'x' });
    caret();
    expect(pasteOf([file()], { 'text/html': '<img src="https://example.com/a.png">' }).defaultPrevented).toBe(true);
  });

  it('leaves files that are not images or videos, and pasting anywhere else, alone', () => {
    make({ uploadHandler: async () => 'x' });
    caret();
    expect(pasteOf([file('a.pdf', 'application/pdf')]).defaultPrevented).toBe(false);
    document.body.insertAdjacentHTML('beforeend', '<textarea id="t"></textarea>');
    expect(pasteOf([file()], {}, document.getElementById('t')!).defaultPrevented).toBe(false);
  });

  it('can be turned off', () => {
    make({ uploadHandler: async () => 'x', uploadOnPaste: false });
    caret();
    expect(pasteOf([file()]).defaultPrevented).toBe(false);
    expect(pending()).toHaveLength(0);
  });

  describe('dropping', () => {
    const dropOf = (files: File[], type: 'dragover' | 'drop' = 'drop', target: Element = editor.querySelector('p')!) => {
      const event = Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
        dataTransfer: { files, types: ['Files'] },
        clientX: 10,
        clientY: 10,
      });
      target.dispatchEvent(event);
      return event;
    };

    it('allows the drop, and puts the files where they were dropped', async () => {
      make({ uploadHandler: async (f) => `https://cdn.test/${f.name}` });
      expect(dropOf([file()], 'dragover').defaultPrevented).toBe(true);
      const firstParagraph = editor.querySelector('p')!;
      (document as any).caretRangeFromPoint = () => {
        const range = document.createRange();
        range.setStart(firstParagraph.firstChild!, 5);
        range.collapse(true);
        return range;
      };
      const event = dropOf([file('dropped.png')]);
      expect(event.defaultPrevented).toBe(true);
      expect(pending()).toHaveLength(1);
      expect(editor.children[1].matches('[data-rte-media-pending]')).toBe(true);
      await vi.waitFor(() => expect(pending()).toHaveLength(0));
      delete (document as any).caretRangeFromPoint;
    });

    it('goes after media it was dropped onto', async () => {
      make({ uploadHandler: async () => 'https://cdn.test/d.png' });
      editor.insertAdjacentHTML('beforeend', `<figure class="rte-media"><img id="under" src="${PIXEL}"></figure>`);
      const figure = editor.querySelector('figure')!;
      (document as any).caretRangeFromPoint = () => {
        const range = document.createRange();
        range.setStart(figure, 0);
        range.collapse(true);
        return range;
      };
      dropOf([file()]);
      expect(figure.nextElementSibling!.matches('[data-rte-media-pending]')).toBe(true);
      delete (document as any).caretRangeFromPoint;
    });

    it('ignores drops outside an editor and drops of other files', () => {
      make({ uploadHandler: async () => 'x' });
      document.body.insertAdjacentHTML('beforeend', '<div id="elsewhere"></div>');
      expect(dropOf([file()], 'dragover', document.getElementById('elsewhere')!).defaultPrevented).toBe(false);
      expect(dropOf([file('a.pdf', 'application/pdf')]).defaultPrevented).toBe(false);
    });
  });
});
