import { createMenuCore } from './menu';
import { createCleanup } from './shared';

export interface ContextMenuOptions {
  /** The area that opens the menu on right click, Shift+F10, the ContextMenu key or a long press. */
  target: HTMLElement;
  /** The menu panel: items are `[role="menuitem"]` or `[data-menu-item]`. */
  menu: HTMLElement;
  onSelect?: (item: HTMLElement) => void;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  /** Touch: press this long to open (default 700 ms; 0 turns the long press off). */
  longPressDelay?: number;
}

export interface ContextMenuController {
  readonly isOpen: boolean;
  /** Opens at a viewport point (or at the target's top-left corner). */
  open(point?: { x: number; y: number }): void;
  close(): void;
  refresh(): void;
  destroy(): void;
}

const pointAnchor = (x: number, y: number) => ({
  getBoundingClientRect: () => ({ x, y, left: x, top: y, right: x, bottom: y, width: 0, height: 0, toJSON() {} }) as DOMRect,
});

/**
 * Context menu behaviour: the WAI-ARIA menu at the pointer, with the keyboard of the menu button
 * (arrows, Home/End, typeahead, Escape returns focus to where it was). The keyboard opens it with
 * Shift+F10 or the ContextMenu key while focus is in the target, and touch with a long press.
 */
export function createContextMenu(options: ContextMenuOptions): ContextMenuController {
  const { target, menu } = options;
  const cleanup = createCleanup();
  const core = createMenuCore({
    menu,
    placement: 'bottom-start',
    offset: 2,
    closeOnSelect: options.closeOnSelect,
    onSelect: options.onSelect,
    onOpenChange: options.onOpenChange,
    onSync: (open) => target.setAttribute('data-state', open ? 'open' : 'closed'),
  });

  const openAt = (x: number, y: number) => {
    const previous = (document.activeElement as HTMLElement | null) ?? target;
    core.open(pointAnchor(x, y), 'first', previous === document.body ? target : previous);
  };

  cleanup.listen(target, 'contextmenu', (event: MouseEvent) => {
    event.preventDefault();
    openAt(event.clientX, event.clientY);
  });
  cleanup.listen(target, 'keydown', (event: KeyboardEvent) => {
    if ((event.key === 'F10' && event.shiftKey) || event.key === 'ContextMenu') {
      event.preventDefault();
      const rect = (document.activeElement && target.contains(document.activeElement) ? document.activeElement : target).getBoundingClientRect();
      openAt(rect.left, rect.bottom);
    }
  });

  // Touch long press (iOS Safari fires no contextmenu event).
  const delay = options.longPressDelay ?? 700;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let start: { x: number; y: number } | null = null;
  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    start = null;
  };
  if (delay > 0) {
    cleanup.listen(target, 'pointerdown', (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;
      start = { x: event.clientX, y: event.clientY };
      timer = setTimeout(() => {
        if (start) openAt(start.x, start.y);
        cancel();
      }, delay);
    });
    cleanup.listen(target, 'pointermove', (event: PointerEvent) => {
      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) cancel();
    });
    cleanup.listen(target, 'pointerup', cancel);
    cleanup.listen(target, 'pointercancel', cancel);
    cleanup.add(cancel);
  }

  return {
    get isOpen() {
      return core.isOpen;
    },
    open(point) {
      if (point) openAt(point.x, point.y);
      else {
        const rect = target.getBoundingClientRect();
        openAt(rect.left, rect.top);
      }
    },
    close: () => core.close(),
    refresh: core.refresh,
    destroy() {
      core.destroy();
      cleanup.run();
    },
  };
}
