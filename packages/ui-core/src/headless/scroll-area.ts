import { createCleanup } from './shared';

export interface ScrollAreaOptions {
  /** Contains a `[data-scroll-viewport]` (the scrolling element) and `[data-scrollbar="vertical"]` / `[data-scrollbar="horizontal"]` tracks, each with a `[data-scroll-thumb]`. */
  root: HTMLElement;
  /**
   * When the scrollbars show (`data-state="visible"`): `'hover'` (default) while the pointer is over
   * the area, `'scroll'` while scrolling, `'auto'` when there is overflow, `'always'`.
   */
  type?: 'hover' | 'scroll' | 'auto' | 'always';
  /** How long they stay after the pointer leaves or scrolling stops, ms (default 600). */
  hideDelay?: number;
}

export interface ScrollAreaController {
  /** Re-measures (the controller also watches size changes where ResizeObserver exists). */
  update(): void;
  destroy(): void;
}

/**
 * Custom scrollbars over native scrolling: the viewport scrolls as usual (wheel, touch, keyboard,
 * assistive technology), its native scrollbar is hidden, and your tracks and thumbs are sized and
 * moved to match. Dragging a thumb scrolls; pressing a track pages. The tracks are `aria-hidden`
 * (the viewport is the accessible scroller) and the viewport is focusable so keyboard users can
 * scroll it.
 */
export function createScrollArea(options: ScrollAreaOptions): ScrollAreaController {
  const { root } = options;
  const cleanup = createCleanup();
  const type = options.type ?? 'hover';
  const hideDelay = options.hideDelay ?? 600;
  const viewport = root.querySelector<HTMLElement>('[data-scroll-viewport]');
  if (!viewport) throw new Error('createScrollArea: no [data-scroll-viewport] inside root');
  const bars = (['vertical', 'horizontal'] as const).map((axis) => {
    const track = root.querySelector<HTMLElement>(`[data-scrollbar="${axis}"]`);
    return { axis, track, thumb: track?.querySelector<HTMLElement>('[data-scroll-thumb]') ?? null, overflow: false };
  });

  viewport.style.setProperty('scrollbar-width', 'none');
  if (bars[0].track) viewport.style.overflowY = 'scroll';
  if (bars[1].track) viewport.style.overflowX = 'scroll';
  hideWebkitScrollbar(root);
  if (!viewport.hasAttribute('tabindex')) viewport.tabIndex = 0;
  for (const bar of bars) {
    bar.track?.setAttribute('aria-hidden', 'true');
    bar.track?.setAttribute('data-orientation', bar.axis);
  }

  let hovering = false;
  let scrolling = false;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const showState = () => {
    for (const bar of bars) {
      if (!bar.track) continue;
      const visible =
        bar.overflow &&
        (type === 'always' || type === 'auto' || (type === 'hover' && (hovering || scrolling)) || (type === 'scroll' && scrolling));
      bar.track.setAttribute('data-state', visible ? 'visible' : 'hidden');
      bar.track.hidden = type === 'always' ? false : !bar.overflow;
    }
  };

  const update = () => {
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = viewport;
    for (const bar of bars) {
      if (!bar.track || !bar.thumb) continue;
      const vertical = bar.axis === 'vertical';
      const size = vertical ? clientHeight : clientWidth;
      const content = vertical ? scrollHeight : scrollWidth;
      const position = vertical ? scrollTop : Math.abs(scrollLeft);
      bar.overflow = content > size + 1;
      const trackSize = (vertical ? bar.track.clientHeight : bar.track.clientWidth) || size;
      const thumbSize = Math.max(18, content ? (size / content) * trackSize : trackSize);
      const room = Math.max(0, trackSize - thumbSize);
      const max = Math.max(1, content - size);
      const offset = (position / max) * room;
      bar.thumb.style[vertical ? 'height' : 'width'] = `${thumbSize}px`;
      bar.thumb.style.transform = vertical ? `translateY(${offset}px)` : `translateX(${offset}px)`;
    }
    root.style.setProperty('--scroll-area-corner', bars.every((bar) => bar.overflow) ? '1' : '0');
    showState();
  };

  const bump = () => {
    scrolling = true;
    showState();
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      scrolling = false;
      showState();
    }, hideDelay);
  };

  cleanup.listen(viewport, 'scroll', () => {
    update();
    bump();
  });
  cleanup.listen(root, 'pointerenter', () => {
    hovering = true;
    if (hideTimer) clearTimeout(hideTimer);
    showState();
  });
  cleanup.listen(root, 'pointerleave', () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      hovering = false;
      showState();
    }, hideDelay);
  });

  for (const bar of bars) {
    const { track, thumb } = bar;
    if (!track || !thumb) continue;
    const vertical = bar.axis === 'vertical';
    let drag: { start: number; scroll: number } | null = null;
    // A touch drag on the thumb moves the thumb, not the page.
    if (!thumb.style.touchAction) thumb.style.touchAction = 'none';
    cleanup.listen(thumb, 'pointerdown', (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      drag = { start: vertical ? event.clientY : event.clientX, scroll: vertical ? viewport.scrollTop : viewport.scrollLeft };
      thumb.setAttribute('data-dragging', '');
      try {
        thumb.setPointerCapture(event.pointerId);
      } catch {
        // synthetic event
      }
    });
    cleanup.listen(thumb, 'pointermove', (event: PointerEvent) => {
      if (!drag) return;
      const trackSize = vertical ? track.clientHeight : track.clientWidth;
      const thumbSize = vertical ? thumb.offsetHeight : thumb.offsetWidth;
      const content = vertical ? viewport.scrollHeight - viewport.clientHeight : viewport.scrollWidth - viewport.clientWidth;
      const ratio = content / Math.max(1, trackSize - thumbSize);
      const delta = ((vertical ? event.clientY : event.clientX) - drag.start) * ratio;
      if (vertical) viewport.scrollTop = drag.scroll + delta;
      else viewport.scrollLeft = drag.scroll + delta;
    });
    const end = () => {
      drag = null;
      thumb.removeAttribute('data-dragging');
    };
    cleanup.listen(thumb, 'pointerup', end);
    cleanup.listen(thumb, 'pointercancel', end);
    cleanup.listen(track, 'pointerdown', (event: PointerEvent) => {
      if (event.button !== 0 || thumb.contains(event.target as Node)) return;
      const rect = thumb.getBoundingClientRect();
      const before = vertical ? event.clientY < rect.top : event.clientX < rect.left;
      const page = (vertical ? viewport.clientHeight : viewport.clientWidth) * 0.9;
      viewport.scrollBy({ [vertical ? 'top' : 'left']: before ? -page : page });
    });
  }

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => update());
    observer.observe(viewport);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
    cleanup.add(() => observer.disconnect());
  }
  cleanup.add(() => {
    if (hideTimer) clearTimeout(hideTimer);
  });

  update();

  return { update, destroy: () => cleanup.run() };
}

const patched = new WeakSet<Document | ShadowRoot>();

/** Safari before 18.2 ignores `scrollbar-width`; a constructable sheet (not blocked by CSP) hides it there. */
function hideWebkitScrollbar(el: HTMLElement) {
  const scope = el.getRootNode() as Document | ShadowRoot;
  if (patched.has(scope) || !('adoptedStyleSheets' in scope) || typeof CSSStyleSheet === 'undefined') return;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync('[data-scroll-viewport]::-webkit-scrollbar{display:none}');
    scope.adoptedStyleSheets = [...scope.adoptedStyleSheets, sheet];
    patched.add(scope);
  } catch {
    // no constructable stylesheets
  }
}
