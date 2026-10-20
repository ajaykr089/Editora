import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeDeps } from './canvasStub';
import { openImageEditor, mimeOf, type ImageEditorDeps, type ImageEditorOptions } from '../ui/imageEditor/imageEditor';
import { editImage } from '../ui/imageEditor/editImage';
import { CropOverlay } from '../ui/imageEditor/cropOverlay';

const picture = (width = 400, height = 200) => ({ source: {} as CanvasImageSource, width, height });
const stubs = (loaded = picture()) => {
  const canvas = fakeDeps({ blobSize: 2048 });
  const deps: ImageEditorDeps = { load: vi.fn(async () => loaded), canvas: canvas.deps };
  return { deps, canvases: canvas.canvases };
};

const dialog = () => document.querySelector('.rte-ie') as HTMLElement;
const q = <T extends HTMLElement = HTMLElement>(selector: string) => dialog().querySelector(selector) as T;
const tool = (label: string) => [...dialog().querySelectorAll<HTMLButtonElement>('.rte-ie-tool')].find((b) => b.textContent === label)!;
const apply = () => q<HTMLButtonElement>('#apply-btn');
const ready = () => vi.waitFor(() => expect(q('.rte-ie-canvas-wrap').hidden).toBe(false));
const lastPreview = (canvases: any[]) => [...canvases].reverse().find((c) => c.calls.some((call: any[]) => call[0] === 'rotate'));

const open = (extra: Partial<ImageEditorOptions> = {}, loaded = picture()) => {
  const { deps, canvases } = stubs(loaded);
  const onApply = vi.fn();
  const onRestore = vi.fn();
  openImageEditor({
    src: 'https://cdn.test/photo.jpg',
    name: 'photo.jpg',
    config: { uploadHandler: async () => 'https://cdn.test/photo-edited.jpg' },
    onApply,
    onRestore,
    deps,
    ...extra,
  });
  return { deps, canvases, onApply, onRestore };
};

beforeEach(() => {
  document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>Text</p></div>';
});
afterEach(() => {
  document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('the image editor opening', () => {
  it('says it is opening, then shows the picture with nothing to apply yet', async () => {
    open();
    expect(q('.rte-ie-status').textContent).toBe('Opening the image…');
    expect(q('.rte-ie-canvas-wrap').hidden).toBe(true);
    await ready();
    expect(q('.rte-ie-status').hidden).toBe(true);
    expect(q('.rte-ie-summary').textContent).toBe('400 × 200 px. Nothing changed yet.');
    expect(apply().disabled).toBe(true);
    expect(dialog().getAttribute('aria-label')).toBe('Edit Image');
  });

  it('explains a picture that cannot be opened, in an alert, and offers nothing to apply', async () => {
    const { deps } = stubs();
    deps.load = async () => {
      throw new Error("This image couldn't be opened for editing. Its server may not allow it (CORS).");
    };
    openImageEditor({ src: 'https://x.test/a.png', name: 'a.png', onApply: vi.fn(), deps });
    await vi.waitFor(() => expect(q('.rte-ie-status').classList.contains('is-error')).toBe(true));
    expect(q('.rte-ie-status').getAttribute('role')).toBe('alert');
    expect(q('.rte-ie-status').textContent).toMatch(/CORS/);
    expect(apply().disabled).toBe(true);
    expect(q<HTMLButtonElement>('.rte-ie-tool').disabled).toBe(true);
  });

  it('reads what the picture is from its address', () => {
    expect(mimeOf('data:image/webp;base64,AAA', 'x')).toBe('image/webp');
    expect(mimeOf('https://cdn.test/a/photo.JPG?v=2', 'x')).toBe('image/jpeg');
    expect(mimeOf('blob:http://localhost/1', 'shot.png')).toBe('image/png');
    expect(mimeOf('https://cdn.test/noextension', 'x')).toBe('image/png');
  });
});

describe('turning and flipping', () => {
  it('turns the preview a quarter, and lets the edit be applied', async () => {
    const { canvases } = open();
    await ready();
    // The preview is drawn to fit the stage, so what is checked is its shape.
    const shape = () => lastPreview(canvases).width / lastPreview(canvases).height;
    expect(shape()).toBeCloseTo(2);
    tool('Rotate right').click();
    expect(shape()).toBeCloseTo(0.5);
    expect(apply().disabled).toBe(false);
    expect(q('.rte-ie-summary').textContent).toMatch(/200 × 400/);
    tool('Rotate left').click();
    expect(shape()).toBeCloseTo(2);
    tool('Rotate left').click();
    expect(shape()).toBeCloseTo(0.5);
  });

  it('flips what is seen', async () => {
    const { canvases } = open();
    await ready();
    tool('Rotate right').click();
    tool('Flip horizontal').click();
    // Turned a quarter, a horizontal flip is a vertical one of the source (see the geometry tests).
    const scale = lastPreview(canvases).calls.find((c: any[]) => c[0] === 'scale');
    expect(scale).toEqual(['scale', 1, -1]);
  });
});

describe('cropping', () => {
  it('shows the crop box only once a shape is chosen, and takes it away with None', async () => {
    open();
    await ready();
    expect(q('.rte-ie-crop-layer').hidden).toBe(true);
    tool('Free').click();
    expect(q('.rte-ie-crop-layer').hidden).toBe(false);
    expect(tool('Free').getAttribute('aria-pressed')).toBe('true');
    expect(apply().disabled).toBe(false);
    tool('None').click();
    expect(q('.rte-ie-crop-layer').hidden).toBe(true);
    expect(apply().disabled).toBe(true);
  });

  it('starts a shaped crop inside the picture, in that shape', async () => {
    open();
    await ready();
    tool('1:1').click();
    const box = q('.rte-ie-crop');
    const w = parseFloat(box.style.width) / 100;
    const h = parseFloat(box.style.height) / 100;
    expect((w * 400) / (h * 200)).toBeCloseTo(1, 5);
    expect(parseFloat(box.style.left) + parseFloat(box.style.width)).toBeLessThanOrEqual(100);
  });

  it('keeps the shape through a turn, by turning it too', async () => {
    open();
    await ready();
    tool('4:3').click();
    tool('Rotate right').click();
    const box = q('.rte-ie-crop');
    const w = (parseFloat(box.style.width) / 100) * 200; // the picture is now 200 wide, 400 high
    const h = (parseFloat(box.style.height) / 100) * 400;
    expect(w / h).toBeCloseTo(3 / 4, 3);
  });

  it('is cut from the picture on Apply: the file is the size of the crop', async () => {
    let made: File | undefined;
    const { onApply, canvases } = open({ config: { uploadHandler: async (file) => ((made = file), 'https://cdn.test/cut.jpg') } });
    await ready();
    tool('1:1').click();
    apply().click();
    await vi.waitFor(() => expect(onApply).toHaveBeenCalled());
    const result = onApply.mock.calls[0][0];
    expect(result.width).toBe(result.height);
    expect(made!.name).toBe('photo-edited.jpg');
    expect(made!.type).toBe('image/jpeg');
    expect(canvases.some((c) => c.width === result.width && c.height === result.height)).toBe(true);
  });
});

describe('size and format', () => {
  it('scales down to a width, from the chips or the field', async () => {
    const { onApply } = open({}, picture(3000, 2000));
    await ready();
    tool('1200').click();
    expect(q<HTMLInputElement>('#ie-width').value).toBe('1200');
    expect(tool('1200').getAttribute('aria-pressed')).toBe('true');
    expect(q('.rte-ie-summary').textContent).toMatch(/1200 × 800/);
    const input = q<HTMLInputElement>('#ie-width');
    input.value = '600';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(q('.rte-ie-summary').textContent).toMatch(/600 × 400/);
    expect(tool('1200').getAttribute('aria-pressed')).toBe('false');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(apply().disabled).toBe(true);
    expect(onApply).not.toHaveBeenCalled();
  });

  it('has a quality slider for JPEG and WebP only, and a format change counts as a change', async () => {
    open({ src: 'https://cdn.test/photo.png', name: 'photo.png' });
    await ready();
    expect(q('.rte-ie-row:has(#ie-quality)').hidden).toBe(true);
    const select = q<HTMLSelectElement>('#ie-format');
    select.value = 'image/webp';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(q('.rte-ie-row:has(#ie-quality)').hidden).toBe(false);
    expect(apply().disabled).toBe(false);
    select.value = 'image/png';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(q('.rte-ie-row:has(#ie-quality)').hidden).toBe(true);
  });

  it('writes the format that was asked for', async () => {
    let made: File | undefined;
    const { onApply } = open({ src: 'https://cdn.test/photo.png', name: 'photo.png', config: { uploadHandler: async (f) => ((made = f), 'https://cdn.test/x.webp') } });
    await ready();
    const select = q<HTMLSelectElement>('#ie-format');
    select.value = 'image/webp';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    apply().click();
    await vi.waitFor(() => expect(onApply).toHaveBeenCalled());
    expect(made!.type).toBe('image/webp');
    expect(made!.name).toBe('photo-edited.webp');
  });

  it('works out the size of the result once the changes settle', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    open();
    await ready();
    tool('Rotate right').click();
    expect(q('.rte-ie-summary').textContent).toMatch(/working out/);
    await vi.advanceTimersByTimeAsync(350);
    await vi.waitFor(() => expect(q('.rte-ie-summary').textContent).toMatch(/about 2 KB/));
  });
});

describe('applying', () => {
  it('stores the picture as a new file and hands back what was stored, with its size', async () => {
    const { onApply } = open();
    await ready();
    tool('Rotate right').click();
    apply().click();
    expect(apply().textContent).toBe('Saving…');
    await vi.waitFor(() => expect(onApply).toHaveBeenCalledTimes(1));
    expect(onApply.mock.calls[0][0]).toMatchObject({ item: { src: 'https://cdn.test/photo-edited.jpg' }, width: 200, height: 400 });
    expect(document.querySelector('.rte-media-overlay')).toBeNull();
  });

  it('keeps the dialog open, with the reason, when it cannot be stored', async () => {
    const { onApply } = open({ config: { uploadHandler: async () => { throw new Error('Storage is full.'); } } });
    await ready();
    tool('Rotate left').click();
    apply().click();
    await vi.waitFor(() => expect(q('.rte-ie-footer-error').hidden).toBe(false));
    expect(q('.rte-ie-footer-error').textContent).toBe('Storage is full.');
    expect(q('.rte-ie-footer-error').getAttribute('role')).toBe('alert');
    expect(apply().disabled).toBe(false);
    expect(onApply).not.toHaveBeenCalled();
  });

  it('is held to the size limit like any upload', async () => {
    open({ config: { uploadHandler: async () => 'x', maxFileSize: 100 } });
    await ready();
    tool('Rotate left').click();
    apply().click();
    await vi.waitFor(() => expect(q('.rte-ie-footer-error').hidden).toBe(false));
    expect(q('.rte-ie-footer-error').textContent).toMatch(/photo-edited\.jpg/);
  });

  it('stops the upload when closed, and changes nothing', async () => {
    let signal!: AbortSignal;
    const { onApply } = open({ config: { uploadHandler: (_f, ctx) => ((signal = ctx.signal!), new Promise(() => {})) } });
    await ready();
    tool('Rotate left').click();
    apply().click();
    await vi.waitFor(() => expect(signal).toBeDefined());
    q<HTMLButtonElement>('.cancel-btn').click();
    expect(signal.aborted).toBe(true);
    expect(document.querySelector('.rte-media-overlay')).toBeNull();
    expect(onApply).not.toHaveBeenCalled();
  });

  it('closes with Escape', async () => {
    open();
    await ready();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('.rte-media-overlay')).toBeNull();
  });

  it('offers to restore the original only when there is one', async () => {
    const without = open();
    await ready();
    expect(q<HTMLButtonElement>('.rte-media-footer .rte-media-btn').hidden).toBe(true);
    without.onRestore.mockClear();
    document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());

    const withOriginal = open({ canRestore: true });
    await ready();
    const button = [...dialog().querySelectorAll<HTMLButtonElement>('.rte-media-footer button')].find((b) => b.textContent === 'Restore original')!;
    expect(button.hidden).toBe(false);
    button.click();
    expect(withOriginal.onRestore).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.rte-media-overlay')).toBeNull();
  });
});

describe('the crop box', () => {
  const make = () => {
    const announced: string[] = [];
    const changes: any[] = [];
    const overlay = new CropOverlay((r) => changes.push(r), (m) => announced.push(m));
    document.body.append(overlay.element);
    overlay.element.getBoundingClientRect = () => ({ left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON() {} }) as DOMRect;
    overlay.setImageSize(2000, 1000);
    overlay.setRect({ x: 0.2, y: 0.2, width: 0.4, height: 0.4 });
    const box = overlay.element.querySelector('.rte-ie-crop') as HTMLElement;
    return { overlay, box, announced, changes };
  };
  const pointer = (type: string, x: number, y: number) =>
    Object.assign(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }), { pointerId: 1, pointerType: 'mouse' });

  it('is placed over the picture in percent, and hidden without a rectangle', () => {
    const { overlay, box } = make();
    expect(box.style.left).toBe('20%');
    expect(box.style.width).toBe('40%');
    expect(overlay.element.hidden).toBe(false);
    overlay.setRect(null);
    expect(overlay.element.hidden).toBe(true);
  });

  it('moves when dragged, by how far the pointer went in fractions of the picture', () => {
    const { box, changes } = make();
    box.dispatchEvent(pointer('pointerdown', 100, 50));
    box.dispatchEvent(pointer('pointermove', 120, 60));
    expect(changes.at(-1).x).toBeCloseTo(0.3);
    expect(changes.at(-1).y).toBeCloseTo(0.3);
    box.dispatchEvent(pointer('pointermove', 900, 900));
    expect(changes.at(-1).x + changes.at(-1).width).toBeLessThanOrEqual(1);
  });

  it('resizes from a handle, from where the drag started (not from where it last was)', () => {
    const { box, changes } = make();
    const handle = box.querySelector('[data-handle="se"]')!;
    handle.dispatchEvent(pointer('pointerdown', 120, 60));
    handle.dispatchEvent(pointer('pointermove', 140, 70));
    handle.dispatchEvent(pointer('pointermove', 140, 70));
    expect(changes.at(-1).width).toBeCloseTo(0.5);
    expect(changes.at(-1).height).toBeCloseTo(0.5);
    expect(changes.at(-1).x).toBeCloseTo(0.2);
  });

  it('keeps a shape while resizing, and says where it ended', () => {
    const { overlay, box, changes, announced } = make();
    overlay.setAspect(1); // square in pixels: 2000 by 1000 makes that 0.5 wide per high in fractions
    const handle = box.querySelector('[data-handle="se"]')!;
    handle.dispatchEvent(pointer('pointerdown', 120, 60));
    handle.dispatchEvent(pointer('pointermove', 160, 60));
    const r = changes.at(-1);
    expect((r.width * 2000) / (r.height * 1000)).toBeCloseTo(1, 5);
    box.dispatchEvent(pointer('pointerup', 160, 60));
    expect(announced.at(-1)).toMatch(/\d+ by \d+ pixels, \d+ from the left, \d+ from the top/);
  });

  it('is a keyboard control: arrows move it, Shift and the arrows resize it, and it says what it is', () => {
    const { box, changes, announced } = make();
    expect(box.getAttribute('role')).toBe('group');
    expect(box.tabIndex).toBe(0);
    expect(box.getAttribute('aria-label')).toMatch(/Arrow keys move it/);
    const press = (key: string, shiftKey = false) => box.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }));
    press('ArrowRight');
    expect(changes.at(-1).x).toBeCloseTo(0.21);
    press('ArrowDown');
    expect(changes.at(-1).y).toBeCloseTo(0.21);
    press('ArrowRight', true);
    expect(changes.at(-1).width).toBeCloseTo(0.41);
    press('ArrowLeft', true);
    press('ArrowLeft', true);
    expect(changes.at(-1).width).toBeCloseTo(0.39);
    expect(announced.at(-1)).toMatch(/pixels/);
    expect(box.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', cancelable: true }))).toBe(true);
    expect(box.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true, cancelable: true }))).toBe(true);
  });
});

describe('editing an image in the document', () => {
  const make = (src: string, extra = '') => {
    document.body.insertAdjacentHTML('beforeend', `<img id="t" src="${src}" width="300" height="150" style="height: 150px; width: 300px" ${extra}>`);
    return document.getElementById('t') as HTMLImageElement;
  };
  const edit = async (img: HTMLImageElement, config = { uploadHandler: async () => 'https://cdn.test/new.png' }) => {
    const { deps } = stubs();
    const changed = vi.fn();
    editImage(img, config, changed, deps);
    await ready();
    return changed;
  };

  it('uses the picture and names the file after it', async () => {
    const img = make('https://cdn.test/folder/Summer%20trip.jpg');
    const { deps } = stubs();
    let made: File | undefined;
    editImage(img, { uploadHandler: async (f) => ((made = f), 'https://cdn.test/new.jpg') }, vi.fn(), deps);
    await ready();
    tool('Rotate left').click();
    apply().click();
    await vi.waitFor(() => expect(made).toBeDefined());
    expect(made!.name).toBe('Summer trip-edited.jpg');
  });

  it('points the image at the new file, keeps its width, lets the height follow, and remembers the original', async () => {
    const img = make('https://cdn.test/a.png');
    const changed = await edit(img);
    tool('Rotate left').click();
    apply().click();
    await vi.waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
    expect(img.getAttribute('src')).toBe('https://cdn.test/new.png');
    expect(img.getAttribute('width')).toBe('300');
    expect(img.hasAttribute('height')).toBe(false);
    expect(img.style.height).toBe('');
    expect(img.getAttribute('data-original-src')).toBe('https://cdn.test/a.png');
  });

  it('does not keep an inline picture as the original (it would double the document)', async () => {
    const img = make('data:image/png;base64,AAAA');
    const changed = await edit(img);
    tool('Rotate left').click();
    apply().click();
    await vi.waitFor(() => expect(changed).toHaveBeenCalled());
    expect(img.hasAttribute('data-original-src')).toBe(false);
  });

  it('keeps the first original through later edits, and can go back to it', async () => {
    const img = make('https://cdn.test/edited-once.png', 'data-original-src="https://cdn.test/first.png"');
    const changed = await edit(img);
    expect([...dialog().querySelectorAll('.rte-media-footer button')].some((b) => b.textContent === 'Restore original' && !(b as HTMLElement).hidden)).toBe(true);
    tool('Rotate left').click();
    apply().click();
    await vi.waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
    expect(img.getAttribute('data-original-src')).toBe('https://cdn.test/first.png');

    const again = await edit(img);
    [...dialog().querySelectorAll<HTMLButtonElement>('.rte-media-footer button')].find((b) => b.textContent === 'Restore original')!.click();
    expect(again).toHaveBeenCalledTimes(1);
    expect(img.getAttribute('src')).toBe('https://cdn.test/first.png');
    expect(img.hasAttribute('data-original-src')).toBe(false);
  });
});
