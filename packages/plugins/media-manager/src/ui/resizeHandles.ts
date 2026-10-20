type Corner = 'nw' | 'ne' | 'sw' | 'se';
const CORNERS: Corner[] = ['nw', 'ne', 'sw', 'se'];
const MIN_SIZE = 50;

/**
 * The four corner handles drawn around the selected image or video. They live on `document.body`, not in the
 * editor, so they never end up in the document. One set exists, however many editors are on the page.
 */
export class ResizeHandles {
  private readonly handles = new Map<Corner, HTMLDivElement>();
  private media: HTMLElement | null = null;
  private drag: { corner: Corner; x: number; y: number; width: number; height: number; before: string } | null = null;

  constructor(
    /** A resize finished: `before` is the editor's content from before the drag. */
    private readonly onResized: (media: HTMLElement, before: string) => void,
    /** Something moved or changed size under the handles (the toolbar follows). */
    private readonly onMoved: () => void,
  ) {
    CORNERS.forEach((corner) => {
      const handle = document.createElement('div');
      handle.className = `media-resize-handle-${corner}`;
      handle.setAttribute('data-position', corner);
      handle.setAttribute('aria-hidden', 'true');
      handle.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: #007bff;
        border: 2px solid white;
        border-radius: 50%;
        cursor: ${corner}-resize;
        z-index: 10001;
        display: none;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      `;
      handle.addEventListener('mousedown', (event) => this.start(event, corner));
      document.body.appendChild(handle);
      this.handles.set(corner, handle);
    });
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
      nw: [rect.left - 5, rect.top - 5],
      ne: [rect.right - 5, rect.top - 5],
      sw: [rect.left - 5, rect.bottom - 5],
      se: [rect.right - 5, rect.bottom - 5],
    };
    this.handles.forEach((handle, corner) => {
      handle.style.left = `${at[corner][0]}px`;
      handle.style.top = `${at[corner][1]}px`;
      handle.style.display = 'block';
    });
  }

  contains(node: EventTarget | null): boolean {
    return node instanceof Node && [...this.handles.values()].some((handle) => handle === node);
  }

  destroy(): void {
    this.stop();
    this.handles.forEach((handle) => handle.remove());
    this.handles.clear();
    this.media = null;
  }

  private start(event: MouseEvent, corner: Corner): void {
    if (!this.media) return;
    event.preventDefault();
    event.stopPropagation();

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
    document.body.style.cursor = `${corner}-resize`;
    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.end);
  }

  private readonly move = (event: MouseEvent): void => {
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
  };

  private readonly end = (): void => {
    const { drag, media } = this;
    this.stop();
    if (drag && media) this.onResized(media, drag.before);
  };

  private stop(): void {
    this.drag = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.end);
  }
}
