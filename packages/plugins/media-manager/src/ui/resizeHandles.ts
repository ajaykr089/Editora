import { injectMediaDialogStyles } from './styles';

type Corner = 'nw' | 'ne' | 'sw' | 'se';
const CORNERS: Corner[] = ['nw', 'ne', 'sw', 'se'];
const MIN_SIZE = 50;

/**
 * The four corner handles drawn around the selected image or video. They live on `document.body`, not in the
 * editor, so they never end up in the document. One set exists, however many editors are on the page. They are
 * dragged with pointer events (mouse, touch and pen alike); the keyboard resizes through the toolbar's Size menu.
 */
export class ResizeHandles {
  private readonly handles = new Map<Corner, HTMLDivElement>();
  private readonly label = document.createElement('div');
  private media: HTMLElement | null = null;
  private drag: { corner: Corner; x: number; y: number; width: number; height: number; before: string } | null = null;

  constructor(
    /** A resize finished: `before` is the editor's content from before the drag. */
    private readonly onResized: (media: HTMLElement, before: string) => void,
    /** Something moved or changed size under the handles (the toolbar follows). */
    private readonly onMoved: () => void,
  ) {
    injectMediaDialogStyles();
    CORNERS.forEach((corner) => {
      const handle = document.createElement('div');
      handle.className = `media-resize-handle-${corner} media-resize-handle`;
      handle.setAttribute('data-position', corner);
      handle.setAttribute('aria-hidden', 'true');
      handle.style.display = 'none';
      handle.style.cursor = `${corner}-resize`;
      handle.addEventListener('pointerdown', (event) => this.start(event, corner, handle));
      handle.addEventListener('pointermove', (event) => this.move(event));
      handle.addEventListener('pointerup', (event) => this.end(event, handle));
      handle.addEventListener('pointercancel', (event) => this.end(event, handle));
      document.body.appendChild(handle);
      this.handles.set(corner, handle);
    });

    this.label.className = 'media-resize-label';
    this.label.setAttribute('aria-hidden', 'true');
    this.label.style.display = 'none';
    document.body.appendChild(this.label);
  }

  /** Put the handles around `media`, or take them away with `null`. */
  show(media: HTMLElement | null): void {
    this.media = media;
    this.update();
  }

  update(): void {
    if (!this.media || !this.media.isConnected) {
      this.handles.forEach((handle) => (handle.style.display = 'none'));
      return;
    }
    const rect = this.media.getBoundingClientRect();
    const at: Record<Corner, [number, number]> = {
      nw: [rect.left, rect.top],
      ne: [rect.right, rect.top],
      sw: [rect.left, rect.bottom],
      se: [rect.right, rect.bottom],
    };
    this.handles.forEach((handle, corner) => {
      // The handle is centred on its corner (its CSS translates it by half its own size).
      handle.style.left = `${at[corner][0]}px`;
      handle.style.top = `${at[corner][1]}px`;
      handle.style.display = 'block';
    });
  }

  contains(node: EventTarget | null): boolean {
    return node instanceof Node && [...this.handles.values()].some((handle) => handle === node);
  }

  destroy(): void {
    this.drag = null;
    document.body.style.userSelect = '';
    this.handles.forEach((handle) => handle.remove());
    this.handles.clear();
    this.label.remove();
    this.media = null;
  }

  private start(event: PointerEvent, corner: Corner, handle: HTMLElement): void {
    if (!this.media || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    event.stopPropagation();
    handle.setPointerCapture?.(event.pointerId);

    const rect = this.media.getBoundingClientRect();
    const host = this.media.closest<HTMLElement>('[contenteditable="true"]');
    this.drag = {
      corner,
      x: event.clientX,
      y: event.clientY,
      width: rect.width,
      height: rect.height,
      before: host?.innerHTML ?? '',
    };
    document.body.style.userSelect = 'none';
  }

  private move(event: PointerEvent): void {
    const { drag, media } = this;
    if (!drag || !media) return;

    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    const east = drag.corner === 'ne' || drag.corner === 'se';
    const south = drag.corner === 'sw' || drag.corner === 'se';
    let width = drag.width + (east ? dx : -dx);
    let height = drag.height + (south ? dy : -dy);

    // Keep the proportions, following whichever direction the pointer moved further.
    const ratio = drag.width / drag.height;
    if (Math.abs(dx) > Math.abs(dy)) height = width / ratio;
    else width = height * ratio;

    width = Math.max(MIN_SIZE, width);
    height = Math.max(MIN_SIZE, height);

    media.style.width = `${width}px`;
    media.style.height = `${height}px`;
    media.setAttribute('width', String(Math.round(width)));
    media.setAttribute('height', String(Math.round(height)));

    this.update();
    this.onMoved();

    this.label.textContent = `${Math.round(width)} × ${Math.round(height)}`;
    this.label.style.left = `${event.clientX + 14}px`;
    this.label.style.top = `${event.clientY + 14}px`;
    this.label.style.display = 'block';
  }

  private end(event: PointerEvent, handle: HTMLElement): void {
    const { drag, media } = this;
    this.drag = null;
    document.body.style.userSelect = '';
    this.label.style.display = 'none';
    if (handle.hasPointerCapture?.(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    if (drag && media) this.onResized(media, drag.before);
  }
}
