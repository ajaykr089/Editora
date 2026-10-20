import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaManagerPlugin } from '../MediaManagerPlugin.native';
import { getMediaController } from '../ui/mediaController';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
let first: HTMLElement;
let second: HTMLElement;

const handles = () => document.querySelectorAll('[class^="media-resize-handle-"]');
const toolbar = () => document.querySelector('.media-floating-toolbar') as HTMLElement | null;
const imageIn = (editor: HTMLElement) => editor.querySelector('img') as HTMLImageElement;
const click = (el: Element) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

beforeEach(() => {
  document.body.innerHTML = `
    <div id="first" class="rte-content" contenteditable="true"><p>One</p><p><img src="${PIXEL}" alt="a"></p></div>
    <div id="second" class="rte-content" contenteditable="true"><p>Two</p><p><img src="${PIXEL}" alt="b"></p></div>
    <button id="outside">outside</button><p id="plain">not an editor</p>`;
  first = document.getElementById('first')!;
  second = document.getElementById('second')!;
  getMediaController().detach();
});

afterEach(() => {
  getMediaController().detach();
  document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
  document.body.innerHTML = '';
  delete (window as any).execEditorCommand;
});

describe('selecting media', () => {
  it('attaches once however often the plugin is made, with one set of four handles', () => {
    MediaManagerPlugin();
    MediaManagerPlugin();
    MediaManagerPlugin().initialize!();
    expect(handles()).toHaveLength(4);
  });

  it('selects an image in either of two editors, one selection at a time', () => {
    MediaManagerPlugin();
    click(imageIn(first));
    expect(getMediaController().selection).toBe(imageIn(first));
    click(imageIn(second));
    expect(getMediaController().selection).toBe(imageIn(second));
    expect(document.querySelectorAll('.media-floating-toolbar')).toHaveLength(1);
  });

  it('keeps the toolbar and handles out of the document being edited', () => {
    MediaManagerPlugin();
    const before = first.innerHTML;
    click(imageIn(first));
    expect(toolbar()).not.toBeNull();
    expect(first.contains(toolbar())).toBe(false);
    // Selecting changes nothing in the document: it is not an edit.
    expect(first.innerHTML).toBe(before);
    expect(first.querySelector('.media-floating-toolbar')).toBeNull();
    expect(first.getAttribute('style')).toBeNull();
    expect(first.querySelector('p')!.getAttribute('style')).toBeNull();
  });

  it('describes the toolbar and its buttons for assistive technology', () => {
    MediaManagerPlugin();
    click(imageIn(first));
    expect(toolbar()!.getAttribute('role')).toBe('toolbar');
    toolbar()!.querySelectorAll('button').forEach((b) => expect(b.getAttribute('aria-label'), b.className).toBeTruthy());
  });

  it('shows no image-only actions for a video', () => {
    MediaManagerPlugin();
    first.insertAdjacentHTML('beforeend', '<video src="x.mp4"></video>');
    click(first.querySelector('video')!);
    expect(toolbar()!.querySelector('.btn-alt')).toBeNull();
    expect(toolbar()!.querySelector('.btn-replace')).toBeNull();
    expect(toolbar()!.querySelector('.btn-align-center')).not.toBeNull();
  });

  it('leaves images outside an editor alone', () => {
    MediaManagerPlugin();
    document.body.insertAdjacentHTML('beforeend', `<img id="loose" src="${PIXEL}">`);
    click(document.getElementById('loose')!);
    expect(getMediaController().selection).toBeNull();
    expect(toolbar()).toBeNull();
  });

  it('deselects on a click elsewhere, but not on a button (the editor toolbar acts on the selection) or on the toolbar', () => {
    MediaManagerPlugin();
    click(imageIn(first));
    click(document.getElementById('outside')!);
    expect(getMediaController().selection).not.toBeNull();
    click(toolbar()!);
    expect(getMediaController().selection).not.toBeNull();
    click(document.getElementById('plain')!);
    expect(getMediaController().selection).toBeNull();
    expect(toolbar()).toBeNull();
    expect([...handles()].every((h) => (h as HTMLElement).style.display === 'none')).toBe(true);
  });

  it('deselects on Escape', () => {
    MediaManagerPlugin();
    click(imageIn(first));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(getMediaController().selection).toBeNull();
  });
});

describe('changing selected media', () => {
  const press = (cls: string) => (toolbar()!.querySelector(cls) as HTMLElement).click();

  it('aligns it, tells the editor, and records one undoable step', () => {
    const recorded = vi.fn();
    (window as any).execEditorCommand = (command: string, ...args: any[]) => command === 'recordDomTransaction' && recorded(...args);
    const onInput = vi.fn();
    first.addEventListener('input', onInput);

    MediaManagerPlugin();
    const before = first.innerHTML;
    click(imageIn(first));
    press('.btn-align-right');

    expect(imageIn(first).style.marginLeft).toBe('auto');
    expect(imageIn(first).style.marginRight).toBe('0px');
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(recorded).toHaveBeenCalledTimes(1);
    expect(recorded.mock.calls[0][0]).toBe(first);
    expect(recorded.mock.calls[0][1]).toBe(before);
    expect(recorded.mock.calls[0][2]).toContain('margin-right');
  });

  it('removes it after confirmation, taking an empty link with it', async () => {
    MediaManagerPlugin();
    const img = imageIn(first);
    img.replaceWith(Object.assign(document.createElement('a'), { href: 'https://example.com' }));
    first.querySelector('a')!.appendChild(img);
    const onInput = vi.fn();
    first.addEventListener('input', onInput);

    click(img);
    press('.btn-remove');
    await vi.waitFor(() => document.querySelector('.rte-media-overlay, [role="alertdialog"], [role="dialog"]'));
    const confirmButton = [...document.querySelectorAll('button')].find((b) => /^remove$/i.test(b.textContent?.trim() ?? ''));
    confirmButton!.click();

    await vi.waitFor(() => expect(first.querySelector('img')).toBeNull());
    expect(first.querySelector('a')).toBeNull();
    expect(onInput).toHaveBeenCalled();
    expect(getMediaController().selection).toBeNull();
  });

  it('rebuilds the toolbar after a link is added so that it shows the new state', () => {
    MediaManagerPlugin();
    click(imageIn(first));
    expect(toolbar()!.querySelector('.btn-link')!.getAttribute('aria-label')).toBe('Add link');
    press('.btn-link');
    const dialog = document.querySelector('.rte-media-dialog') as HTMLElement;
    (dialog.querySelector('#link-url') as HTMLInputElement).value = 'example.com';
    (dialog.querySelector('.save-btn') as HTMLButtonElement).click();
    expect(imageIn(first).closest('a')!.getAttribute('href')).toBe('https://example.com');
    expect(toolbar()!.querySelector('.btn-link')!.getAttribute('aria-label')).toBe('Edit or remove link');
  });

  it('records an alt text change as an undoable step', () => {
    const recorded = vi.fn();
    (window as any).execEditorCommand = (command: string, ...args: any[]) => command === 'recordDomTransaction' && recorded(...args);
    MediaManagerPlugin();
    click(imageIn(first));
    press('.btn-alt');
    const dialog = document.querySelector('.rte-media-dialog') as HTMLElement;
    (dialog.querySelector('#alt-text-input') as HTMLTextAreaElement).value = 'A cat';
    (dialog.querySelector('.save-btn') as HTMLButtonElement).click();
    expect(imageIn(first).alt).toBe('A cat');
    expect(recorded).toHaveBeenCalledTimes(1);
    expect(recorded.mock.calls[0][1]).toContain('alt="a"');
    expect(recorded.mock.calls[0][2]).toContain('alt="A cat"');
  });
});

describe('resizing', () => {
  it('drags a corner, keeps the proportions, and records the whole drag as one step', () => {
    const recorded = vi.fn();
    (window as any).execEditorCommand = (command: string, ...args: any[]) => command === 'recordDomTransaction' && recorded(...args);
    MediaManagerPlugin();
    const img = imageIn(first);
    img.getBoundingClientRect = () => ({ left: 10, top: 10, right: 210, bottom: 110, width: 200, height: 100, x: 10, y: 10, toJSON() {} }) as DOMRect;
    click(img);

    const handle = document.querySelector('.media-resize-handle-se') as HTMLElement;
    handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 210, clientY: 110 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 310, clientY: 115 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 410, clientY: 120 }));
    expect(img.style.width).toBe('400px');
    expect(img.style.height).toBe('200px');
    expect(recorded).not.toHaveBeenCalled();

    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(recorded).toHaveBeenCalledTimes(1);
    expect(img.getAttribute('width')).toBe('400');

    // Nothing is listening once the drag is over.
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 900, clientY: 900 }));
    expect(img.style.width).toBe('400px');
  });

  it('never goes below 50px', () => {
    MediaManagerPlugin();
    const img = imageIn(first);
    img.getBoundingClientRect = () => ({ left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON() {} }) as DOMRect;
    click(img);
    document.querySelector('.media-resize-handle-se')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 200, clientY: 100 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: -500, clientY: 100 }));
    expect(parseInt(img.style.width, 10)).toBeGreaterThanOrEqual(50);
    document.dispatchEvent(new MouseEvent('mouseup'));
  });
});

describe('tearing down', () => {
  it('destroy removes the handles, the toolbar and the listeners', () => {
    const plugin = MediaManagerPlugin();
    click(imageIn(first));
    plugin.destroy!();
    expect(handles()).toHaveLength(0);
    expect(toolbar()).toBeNull();
    click(imageIn(second));
    expect(getMediaController().selection).toBeNull();
  });

  it('can be set up again after a destroy', () => {
    const plugin = MediaManagerPlugin();
    plugin.destroy!();
    plugin.initialize!();
    click(imageIn(first));
    expect(getMediaController().selection).toBe(imageIn(first));
    expect(handles()).toHaveLength(4);
  });
});
