import { resolveMediaManagerConfig } from '../../constants';
import {
  ImageEditError,
  defaultCanvasDeps,
  drawTransformed,
  encodeCanvas,
  loadImage,
  renderEdited,
  type CanvasDeps,
} from '../../imaging/canvas';
import {
  cropPixels,
  editedFileName,
  flipVisual,
  initialState,
  isUnchanged,
  outputSize,
  rectWithAspect,
  resolveFormat,
  rotate,
  transformedSize,
  type EditState,
  type OutputFormat,
  type Rect,
} from '../../imaging/geometry';
import { isAbort } from '../../providers';
import type { MediaItem, MediaManagerConfig } from '../../types/media';
import { uploadMedia } from '../../uploadService';
import { attachEscapeCloseHandler, createDialogOverlay, createDialogShell } from '../dialogKit';
import { icons } from '../picker/icons';
import { injectMediaDialogStyles } from '../styles';
import { CropOverlay } from './cropOverlay';
import { injectImageEditorStyles } from './styles';

export interface ImageEditorDeps {
  load: (src: string) => Promise<{ source: CanvasImageSource; width: number; height: number }>;
  canvas: CanvasDeps;
}

const defaultDeps: ImageEditorDeps = {
  load: async (src) => {
    const image = await loadImage(src);
    return { source: image, width: image.naturalWidth, height: image.naturalHeight };
  },
  canvas: defaultCanvasDeps,
};

export interface ImageEditResult {
  /** The edited picture as stored. */
  item: MediaItem;
  width: number;
  height: number;
}

export interface ImageEditorOptions {
  src: string;
  name: string;
  config?: Partial<MediaManagerConfig>;
  contextElement?: HTMLElement | null;
  /** There is an unedited original to go back to (it was kept when the picture was first edited). */
  canRestore?: boolean;
  onApply: (result: ImageEditResult) => void;
  onRestore?: () => void;
  deps?: ImageEditorDeps;
}

type Shape = { kind: 'none' } | { kind: 'free' } | { kind: 'original' } | { kind: 'ratio'; id: string; ratio: number };

const SHAPES: Array<{ id: string; label: string; shape: Shape }> = [
  { id: 'none', label: 'None', shape: { kind: 'none' } },
  { id: 'free', label: 'Free', shape: { kind: 'free' } },
  { id: 'original', label: 'Original', shape: { kind: 'original' } },
  { id: '1:1', label: '1:1', shape: { kind: 'ratio', id: '1:1', ratio: 1 } },
  { id: '4:3', label: '4:3', shape: { kind: 'ratio', id: '4:3', ratio: 4 / 3 } },
  { id: '3:2', label: '3:2', shape: { kind: 'ratio', id: '3:2', ratio: 3 / 2 } },
  { id: '16:9', label: '16:9', shape: { kind: 'ratio', id: '16:9', ratio: 16 / 9 } },
];

const WIDTHS: Array<number | null> = [null, 2048, 1600, 1200, 800];

const FORMATS: Array<[OutputFormat, string]> = [
  ['keep', 'Same as original'],
  ['image/jpeg', 'JPEG'],
  ['image/webp', 'WebP'],
  ['image/png', 'PNG'],
];

const svg = (body: string) =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const TOOL_ICONS = {
  rotateLeft: svg('<path d="M3 12a9 9 0 1 1 3 6.7"></path><path d="M3 5v7h7"></path>'),
  rotateRight: svg('<path d="M21 12a9 9 0 1 0-3 6.7"></path><path d="M21 5v7h-7"></path>'),
  flipH: svg('<path d="M12 3v18"></path><path d="M8 7 3 17h5z"></path><path d="m16 7 5 10h-5z"></path>'),
  flipV: svg('<path d="M3 12h18"></path><path d="m7 8 10-5v5z"></path><path d="m7 16 10 5v-5z"></path>'),
};

const MIME_BY_EXTENSION: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' };

/** What the picture is, from its address (a data URL says so) or its name. */
export const mimeOf = (src: string, name: string): string => {
  const data = /^data:([^;,]+)/.exec(src);
  if (data) return data[1];
  const extension = /\.([a-z0-9]+)(?:[?#]|$)/i.exec(src)?.[1] ?? /\.([a-z0-9]+)$/i.exec(name)?.[1];
  return MIME_BY_EXTENSION[extension?.toLowerCase() ?? ''] ?? 'image/png';
};

const formatBytes = (bytes: number): string => (bytes >= 1024 * 1024 ? `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

/**
 * Edit a picture: turn it, flip it, crop it (free or to a shape), scale it down, choose how it is saved. The
 * result is stored as a new file, so the original stays where it was. Nothing happens to the document until Apply.
 */
export const openImageEditor = (options: ImageEditorOptions): void => {
  const deps = options.deps ?? defaultDeps;
  const config = resolveMediaManagerConfig(options.config);
  const sourceType = mimeOf(options.src, options.name);
  injectMediaDialogStyles();
  injectImageEditorStyles();

  let state: EditState = initialState();
  let shape: Shape = { kind: 'none' };
  let picture: { source: CanvasImageSource; width: number; height: number } | null = null;
  let applying = false;
  let estimateToken = 0;
  let estimateTimer: ReturnType<typeof setTimeout> | undefined;
  const upload = new AbortController();

  // ── layout ──────────────────────────────────────────────────────────────────────────────────
  const overlay = createDialogOverlay(options.contextElement);
  const dialog = createDialogShell();
  dialog.classList.add('rte-ie');

  const header = el('div', 'rte-media-header');
  const title = el('h2', 'rte-media-title', 'Edit Image');
  const closeButton = el('button', 'close-btn rte-media-close-btn');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.innerHTML = icons.close;
  header.append(title, closeButton);

  const stage = el('div', 'rte-ie-stage');
  const status = el('p', 'rte-ie-status', 'Opening the image…');
  status.setAttribute('role', 'status');
  const wrap = el('div', 'rte-ie-canvas-wrap');
  wrap.hidden = true;
  const live = el('div', 'rte-mp-sr');
  live.setAttribute('aria-live', 'polite');
  const crop = new CropOverlay(
    (rect) => {
      state = { ...state, crop: rect };
      refresh();
    },
    (message) => (live.textContent = message),
  );
  stage.append(status, wrap, live);

  const panel = el('div', 'rte-ie-panel');
  const section = (legend: string) => {
    const group = el('fieldset', 'rte-ie-section');
    group.append(el('legend', undefined, legend));
    return group;
  };
  const tool = (label: string, icon = '') => {
    const button = el('button', 'rte-ie-tool');
    button.type = 'button';
    button.innerHTML = `${icon}<span></span>`;
    button.querySelector('span')!.textContent = label;
    return button;
  };

  const orientation = section('Orientation');
  const orientationGrid = el('div', 'rte-ie-grid');
  const rotateLeft = tool('Rotate left', TOOL_ICONS.rotateLeft);
  const rotateRight = tool('Rotate right', TOOL_ICONS.rotateRight);
  const flipH = tool('Flip horizontal', TOOL_ICONS.flipH);
  const flipV = tool('Flip vertical', TOOL_ICONS.flipV);
  orientationGrid.append(rotateLeft, rotateRight, flipH, flipV);
  orientation.append(orientationGrid);

  const cropSection = section('Crop');
  const shapeChips = el('div', 'rte-ie-chips');
  shapeChips.setAttribute('role', 'group');
  shapeChips.setAttribute('aria-label', 'Crop shape');
  const shapeButtons = new Map<string, HTMLButtonElement>();
  for (const entry of SHAPES) {
    const button = tool(entry.label);
    button.dataset.shape = entry.id;
    button.addEventListener('click', () => chooseShape(entry.shape));
    shapeButtons.set(entry.id, button);
    shapeChips.append(button);
  }
  cropSection.append(shapeChips);

  const sizeSection = section('Size');
  const widthRow = el('div', 'rte-ie-row');
  const widthLabel = el('label', undefined, 'Max width');
  widthLabel.htmlFor = 'ie-width';
  const widthInput = el('input');
  widthInput.type = 'number';
  widthInput.id = 'ie-width';
  widthInput.min = '16';
  widthInput.step = '1';
  widthInput.placeholder = 'Original';
  widthRow.append(widthLabel, widthInput, el('span', 'rte-ie-quality', 'px'));
  const widthChips = el('div', 'rte-ie-chips');
  widthChips.style.marginTop = '8px';
  const widthButtons = new Map<number | null, HTMLButtonElement>();
  for (const width of WIDTHS) {
    const button = tool(width === null ? 'Original' : String(width));
    button.addEventListener('click', () => setMaxWidth(width));
    widthButtons.set(width, button);
    widthChips.append(button);
  }
  sizeSection.append(widthRow, widthChips);

  const formatSection = section('Save as');
  const formatRow = el('div', 'rte-ie-row');
  formatRow.style.marginTop = '0';
  const formatLabel = el('label', undefined, 'Format');
  formatLabel.htmlFor = 'ie-format';
  const formatSelect = el('select', 'rte-ie-select');
  formatSelect.id = 'ie-format';
  for (const [value, label] of FORMATS) {
    const option = el('option', undefined, label);
    option.value = value;
    formatSelect.append(option);
  }
  formatRow.append(formatLabel, formatSelect);
  const qualityRow = el('div', 'rte-ie-row');
  const qualityLabel = el('label', undefined, 'Quality');
  qualityLabel.htmlFor = 'ie-quality';
  const qualityInput = el('input');
  qualityInput.type = 'range';
  qualityInput.id = 'ie-quality';
  qualityInput.min = '40';
  qualityInput.max = '100';
  qualityInput.step = '1';
  qualityInput.value = String(Math.round(state.quality * 100));
  const qualityValue = el('output', 'rte-ie-quality');
  qualityValue.htmlFor = 'ie-quality';
  qualityRow.append(qualityLabel, qualityInput, qualityValue);
  formatSection.append(formatRow, qualityRow);

  const summary = el('p', 'rte-ie-summary');
  summary.setAttribute('aria-live', 'polite');

  panel.append(orientation, cropSection, sizeSection, formatSection, summary);

  const body = el('div', 'rte-ie-body');
  body.append(stage, panel);

  const footer = el('div', 'rte-media-footer');
  const restore = el('button', 'rte-media-btn rte-media-btn-secondary', 'Restore original');
  restore.type = 'button';
  restore.hidden = !options.canRestore;
  const footerError = el('p', 'rte-ie-footer-error');
  footerError.setAttribute('role', 'alert');
  footerError.hidden = true;
  const cancel = el('button', 'cancel-btn rte-media-btn rte-media-btn-secondary', 'Cancel');
  cancel.type = 'button';
  const apply = el('button', 'rte-media-btn rte-media-btn-primary', 'Apply');
  apply.type = 'button';
  apply.id = 'apply-btn';
  apply.disabled = true;
  footer.append(restore, footerError, el('span', 'rte-mp-spacer'), cancel, apply);

  dialog.append(header, body, footer);
  overlay.append(dialog);
  document.body.append(overlay);

  // ── behaviour ───────────────────────────────────────────────────────────────────────────────
  const hasChanges = () => !isUnchanged(state) || state.format !== 'keep' || state.quality !== initialState().quality;
  const turned = () => (picture ? transformedSize(picture.width, picture.height, state.rotation) : { width: 1, height: 1 });
  const currentRatio = (): number | null => {
    if (shape.kind === 'ratio') return shape.ratio;
    if (shape.kind === 'original') return turned().width / turned().height;
    return null;
  };

  const shrink = (rect: Rect, by: number): Rect => ({
    x: rect.x + (rect.width * (1 - by)) / 2,
    y: rect.y + (rect.height * (1 - by)) / 2,
    width: rect.width * by,
    height: rect.height * by,
  });

  function chooseShape(next: Shape): void {
    shape = next;
    if (next.kind === 'none') {
      state = { ...state, crop: null };
      crop.setRect(null);
    } else if (next.kind === 'free') {
      crop.setAspect(null);
      state = { ...state, crop: state.crop ?? { x: 0.1, y: 0.1, width: 0.8, height: 0.8 } };
      crop.setRect(state.crop);
    } else {
      const ratio = currentRatio()!;
      crop.setAspect(ratio);
      const t = turned();
      state = { ...state, crop: shrink(rectWithAspect(ratio, t.width, t.height, state.crop ?? undefined), 0.9) };
      crop.setRect(state.crop);
    }
    refresh();
  }

  function setMaxWidth(width: number | null): void {
    state = { ...state, maxWidth: width };
    widthInput.value = width === null ? '' : String(width);
    refresh();
  }

  function transform(next: EditState): void {
    const wasQuarterTurn = next.rotation !== state.rotation;
    state = next;
    // The crop has turned with the picture; a shape that is not free turns with it too.
    if (shape.kind === 'ratio' && wasQuarterTurn) shape = { ...shape, ratio: 1 / shape.ratio };
    crop.setImageSize(turned().width, turned().height);
    crop.setAspect(currentRatio());
    crop.setRect(state.crop);
    redraw();
    refresh();
  }

  function redraw(): void {
    if (!picture) return;
    const t = turned();
    const availableWidth = Math.max(160, (stage.clientWidth || 520) - 32);
    const availableHeight = Math.max(120, (stage.clientHeight || 400) - 32);
    const scale = Math.min(1, availableWidth / t.width, availableHeight / t.height);
    const canvas = drawTransformed(picture.source, picture.width, picture.height, state, scale, deps.canvas);
    wrap.replaceChildren(canvas, crop.element);
    crop.setImageSize(t.width, t.height);
  }

  function refresh(): void {
    for (const [id, button] of shapeButtons) {
      const on = id === 'original' ? shape.kind === 'original' : id === 'none' ? shape.kind === 'none' : id === 'free' ? shape.kind === 'free' : shape.kind === 'ratio' && shape.id === id;
      button.setAttribute('aria-pressed', String(on));
    }
    for (const [width, button] of widthButtons) button.setAttribute('aria-pressed', String(state.maxWidth === width));
    const resolved = resolveFormat(state.format, sourceType);
    qualityRow.hidden = resolved === 'image/png';
    qualityValue.textContent = `${Math.round(state.quality * 100)}`;
    for (const control of [rotateLeft, rotateRight, flipH, flipV, widthInput, formatSelect, qualityInput, ...shapeButtons.values(), ...widthButtons.values()]) {
      control.disabled = !picture || applying;
    }
    apply.disabled = !picture || applying || !hasChanges();
    apply.textContent = applying ? 'Saving…' : 'Apply';
    scheduleEstimate();
  }

  function scheduleEstimate(): void {
    if (!picture) return;
    estimateToken++;
    clearTimeout(estimateTimer);
    const c = cropPixels(state.crop, turned().width, turned().height);
    const out = outputSize(c.width, c.height, state.maxWidth);
    const note = sourceType === 'image/gif' ? ' A GIF is saved as a still picture.' : '';
    const sizes = `<strong>${out.width} × ${out.height}</strong> px`;
    if (!hasChanges()) {
      summary.innerHTML = '';
      summary.textContent = `${picture.width} × ${picture.height} px. Nothing changed yet.${note}`;
      return;
    }
    summary.innerHTML = `${sizes}, working out the file size…`;
    const token = estimateToken;
    estimateTimer = setTimeout(async () => {
      try {
        const canvas = renderEdited(picture!.source, picture!.width, picture!.height, state, sourceType, deps.canvas);
        const blob = await encodeCanvas(canvas, resolveFormat(state.format, sourceType), state.quality);
        if (token !== estimateToken) return;
        summary.innerHTML = `${sizes}, about <strong>${formatBytes(blob.size)}</strong>.`;
        if (note) summary.append(note);
      } catch (error) {
        if (token !== estimateToken) return;
        summary.textContent = error instanceof Error ? error.message : "Couldn't prepare the picture.";
      }
    }, 300);
  }

  function close(): void {
    clearTimeout(estimateTimer);
    estimateToken++;
    upload.abort();
    cleanupEscape();
    crop.dispose();
    resizeObserver?.disconnect();
    overlay.remove();
  }

  async function applyEdits(): Promise<void> {
    if (!picture || applying || !hasChanges()) return;
    applying = true;
    footerError.hidden = true;
    refresh();
    try {
      const canvas = renderEdited(picture.source, picture.width, picture.height, state, sourceType, deps.canvas);
      const blob = await encodeCanvas(canvas, resolveFormat(state.format, sourceType), state.quality);
      const type = blob.type || resolveFormat(state.format, sourceType);
      const file = new File([blob], editedFileName(options.name, type), { type });
      const item = await uploadMedia(file, {
        config: options.config,
        signal: upload.signal,
        onProgress: ({ fraction }) => (apply.textContent = `Saving… ${Math.round(fraction * 100)}%`),
      });
      close();
      options.onApply({ item, width: canvas.width, height: canvas.height });
    } catch (error) {
      if (isAbort(error)) return;
      applying = false;
      footerError.textContent = error instanceof Error && error.message ? error.message : "Couldn't save the picture.";
      footerError.hidden = false;
      refresh();
    }
  }

  let cleanupEscape = () => {};
  cleanupEscape = attachEscapeCloseHandler(overlay, close);
  closeButton.addEventListener('click', close);
  cancel.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  apply.addEventListener('click', () => void applyEdits());
  restore.addEventListener('click', () => {
    close();
    options.onRestore?.();
  });
  rotateLeft.addEventListener('click', () => transform(rotate(state, -1)));
  rotateRight.addEventListener('click', () => transform(rotate(state, 1)));
  flipH.addEventListener('click', () => transform(flipVisual(state, 'h')));
  flipV.addEventListener('click', () => transform(flipVisual(state, 'v')));
  widthInput.addEventListener('input', () => {
    const value = parseInt(widthInput.value, 10);
    state = { ...state, maxWidth: Number.isFinite(value) && value > 0 ? value : null };
    refresh();
  });
  formatSelect.addEventListener('change', () => {
    state = { ...state, format: formatSelect.value as OutputFormat };
    refresh();
  });
  qualityInput.addEventListener('input', () => {
    state = { ...state, quality: Number(qualityInput.value) / 100 };
    refresh();
  });

  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => redraw());

  refresh();
  deps
    .load(options.src)
    .then((loaded) => {
      if (!overlay.isConnected) return;
      picture = loaded;
      status.hidden = true;
      wrap.hidden = false;
      crop.setImageSize(turned().width, turned().height);
      redraw();
      resizeObserver?.observe(stage);
      refresh();
      summary.textContent = `${loaded.width} × ${loaded.height} px. Nothing changed yet.`;
      rotateLeft.focus({ preventScroll: true });
    })
    .catch((error: unknown) => {
      if (!overlay.isConnected) return;
      status.classList.add('is-error');
      status.setAttribute('role', 'alert');
      status.textContent = error instanceof ImageEditError || error instanceof Error ? error.message : "This image couldn't be opened.";
      summary.textContent = '';
    });
};
