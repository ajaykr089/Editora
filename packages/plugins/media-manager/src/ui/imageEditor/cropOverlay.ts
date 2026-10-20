import { aspectInFractions, moveRect, resizeRect, type Handle, type Rect } from '../../imaging/geometry';

const HANDLES: Handle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const STEP = 0.01;

/**
 * The crop box over the preview: drag it to move, drag a handle to resize (a corner keeps its shape when a shape
 * is chosen), or use the keyboard (arrows move it, Shift and the arrows resize it). Everything is in fractions of
 * the picture, so it does not care how large the preview is drawn.
 */
export class CropOverlay {
  /** Covers the preview exactly; put it over the canvas. */
  readonly element = document.createElement('div');
  private readonly box = document.createElement('div');
  private rect: Rect | null = null;
  private aspect: number | null = null;
  private imageWidth = 1;
  private imageHeight = 1;
  private drag: { mode: 'move' | Handle; x: number; y: number; start: Rect } | null = null;

  constructor(
    private readonly onChange: (rect: Rect) => void,
    private readonly announce: (message: string) => void,
  ) {
    this.element.className = 'rte-ie-crop-layer';
    this.box.className = 'rte-ie-crop';
    this.box.setAttribute('role', 'group');
    this.box.setAttribute('aria-label', 'Crop area. Arrow keys move it, Shift and the arrow keys resize it.');
    this.box.tabIndex = 0;
    for (const handle of HANDLES) {
      const node = document.createElement('div');
      node.className = `rte-ie-handle rte-ie-handle-${handle}`;
      node.dataset.handle = handle;
      node.setAttribute('aria-hidden', 'true');
      this.box.append(node);
    }
    this.element.append(this.box);
    this.element.hidden = true;

    this.box.addEventListener('pointerdown', this.onPointerDown);
    this.box.addEventListener('pointermove', this.onPointerMove);
    this.box.addEventListener('pointerup', this.onPointerUp);
    this.box.addEventListener('pointercancel', this.onPointerUp);
    this.box.addEventListener('keydown', this.onKeyDown);
  }

  get current(): Rect | null {
    return this.rect;
  }

  /** The size of the picture the fractions are fractions of, in pixels. */
  setImageSize(width: number, height: number): void {
    this.imageWidth = width;
    this.imageHeight = height;
  }

  /** A shape to keep (width / height in pixels), or `null` for any. */
  setAspect(ratio: number | null): void {
    this.aspect = ratio === null ? null : aspectInFractions(ratio, this.imageWidth, this.imageHeight);
  }

  setRect(rect: Rect | null): void {
    this.rect = rect;
    this.element.hidden = rect === null;
    if (!rect) return;
    this.box.style.left = `${rect.x * 100}%`;
    this.box.style.top = `${rect.y * 100}%`;
    this.box.style.width = `${rect.width * 100}%`;
    this.box.style.height = `${rect.height * 100}%`;
  }

  focus(): void {
    this.box.focus({ preventScroll: true });
  }

  private change(rect: Rect): void {
    this.setRect(rect);
    this.onChange(rect);
  }

  private describe(rect: Rect): string {
    const w = Math.round(rect.width * this.imageWidth);
    const h = Math.round(rect.height * this.imageHeight);
    return `${w} by ${h} pixels, ${Math.round(rect.x * this.imageWidth)} from the left, ${Math.round(rect.y * this.imageHeight)} from the top`;
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (!this.rect || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const target = event.target as HTMLElement;
    const handle = target.dataset.handle as Handle | undefined;
    event.preventDefault();
    this.box.setPointerCapture?.(event.pointerId);
    this.box.focus({ preventScroll: true });
    this.drag = { mode: handle ?? 'move', x: event.clientX, y: event.clientY, start: this.rect };
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    const { drag } = this;
    if (!drag) return;
    const bounds = this.element.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const dx = (event.clientX - drag.x) / bounds.width;
    const dy = (event.clientY - drag.y) / bounds.height;
    this.change(drag.mode === 'move' ? moveRect(drag.start, dx, dy) : resizeRect(drag.start, drag.mode, dx, dy, this.aspect));
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (!this.drag) return;
    this.drag = null;
    if (this.box.hasPointerCapture?.(event.pointerId)) this.box.releasePointerCapture(event.pointerId);
    if (this.rect) this.announce(this.describe(this.rect));
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!this.rect || event.ctrlKey || event.metaKey || event.altKey) return;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
    };
    const step = delta[event.key];
    if (!step) return;
    event.preventDefault();
    // Shift resizes from the bottom-right corner, so that right and down grow it and left and up shrink it.
    const next = event.shiftKey
      ? resizeRect(this.rect, 'se', step[0], step[1], this.aspect)
      : moveRect(this.rect, step[0], step[1]);
    this.change(next);
    this.announce(this.describe(next));
  };

  dispose(): void {
    this.drag = null;
    this.element.remove();
  }
}
