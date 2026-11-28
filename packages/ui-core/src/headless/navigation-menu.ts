import { createCleanup, ensureId, setState } from './shared';

export interface NavigationMenuOptions {
  /**
   * The `<nav>` (give it an `aria-label`). Top-level entries are `[data-nav-item]` with a
   * `data-value`; an entry with a submenu holds a `[data-nav-trigger]` button and a
   * `[data-nav-content]` panel of links, a plain entry just a link.
   */
  root: HTMLElement;
  /** Hover opens after this many ms (default 200; set -1 to open on click only). */
  openDelay?: number;
  closeDelay?: number;
  orientation?: 'horizontal' | 'vertical';
  onValueChange?: (value: string) => void;
}

export interface NavigationMenuController {
  /** The open entry's value, '' when none. */
  readonly value: string;
  setValue(value: string): void;
  refresh(): void;
  destroy(): void;
}

interface Entry {
  item: HTMLElement;
  value: string;
  trigger: HTMLElement | null;
  content: HTMLElement | null;
  focusable: HTMLElement;
}

/**
 * Site navigation behaviour (WAI-ARIA disclosure navigation): each submenu trigger is a button with
 * `aria-expanded`; one panel is open at a time; hovering opens it after a short delay; Escape closes
 * and returns focus to its trigger; focus or a click leaving the nav closes it. The arrow keys move
 * between top-level entries, and Arrow Down from a trigger enters its panel (then arrows move
 * between the panel's links). Links stay ordinary links, in the tab order.
 */
export function createNavigationMenu(options: NavigationMenuOptions): NavigationMenuController {
  const { root } = options;
  const cleanup = createCleanup();
  const openDelay = options.openDelay ?? 200;
  const closeDelay = options.closeDelay ?? 300;
  const vertical = options.orientation === 'vertical';
  let entries: Entry[] = [];
  let value = '';
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clear = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const read = () => {
    entries = Array.from(root.querySelectorAll<HTMLElement>('[data-nav-item]'))
      .filter((item) => {
        // Top level only: no other entry of this nav around it.
        const outer = item.parentElement?.closest('[data-nav-item]');
        return !outer || !root.contains(outer);
      })
      .map((item, index) => {
        const trigger = item.querySelector<HTMLElement>('[data-nav-trigger]');
        const content = item.querySelector<HTMLElement>('[data-nav-content]');
        const focusable = trigger ?? item.querySelector<HTMLElement>('a[href], button') ?? item;
        if (trigger && content) {
          if (trigger.tagName === 'BUTTON' && !trigger.hasAttribute('type')) trigger.setAttribute('type', 'button');
          trigger.setAttribute('aria-controls', ensureId(content, 'ui-nav-content'));
        }
        return { item, value: item.getAttribute('data-value') || String(index), trigger, content, focusable };
      });
  };

  const sync = () => {
    for (const entry of entries) {
      const on = !!entry.content && entry.value === value;
      if (entry.trigger) {
        entry.trigger.setAttribute('aria-expanded', String(on));
        setState(on ? 'open' : 'closed', entry.trigger);
      }
      if (entry.content) {
        entry.content.hidden = !on;
        setState(on ? 'open' : 'closed', entry.content);
      }
      setState(on ? 'open' : 'closed', entry.item);
    }
    root.setAttribute('data-state', value ? 'open' : 'closed');
  };

  const set = (next: string) => {
    clear();
    if (next === value) return;
    value = next;
    sync();
    options.onValueChange?.(value);
  };

  const entryOf = (node: EventTarget | null) => entries.find((entry) => entry.item.contains(node as Node));

  cleanup.listen(root, 'click', (event: MouseEvent) => {
    const entry = entries.find((candidate) => candidate.trigger?.contains(event.target as Node));
    if (!entry || !entry.content) return;
    set(value === entry.value ? '' : entry.value);
  });

  if (openDelay >= 0) {
    cleanup.listen(root, 'pointerover', (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const entry = entryOf(event.target);
      if (!entry) return;
      clear();
      if (!entry.content) {
        if (value) timer = setTimeout(() => set(''), closeDelay);
        return;
      }
      if (entry.value === value) return;
      // Moving between entries while one is open switches at once.
      timer = setTimeout(() => set(entry.value), value ? 0 : openDelay);
    });
    cleanup.listen(root, 'pointerleave', (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      clear();
      if (value) timer = setTimeout(() => set(''), closeDelay);
    });
  }

  cleanup.listen(root, 'keydown', (event: KeyboardEvent) => {
    const entry = entryOf(event.target);
    if (!entry) return;
    const inContent = !!entry.content && entry.content.contains(event.target as Node);
    if (event.key === 'Escape') {
      if (!value) return;
      const open = entries.find((candidate) => candidate.value === value);
      set('');
      open?.trigger?.focus();
      event.preventDefault();
      return;
    }
    const rtl = getComputedStyle(root).direction === 'rtl';
    const nextKey = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    if (inContent) {
      const links = Array.from(entry.content!.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const index = links.indexOf(event.target as HTMLElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const target = links[(index + step + links.length) % links.length];
        target?.focus();
        event.preventDefault();
      } else if (event.key === 'Home' || event.key === 'End') {
        links[event.key === 'Home' ? 0 : links.length - 1]?.focus();
        event.preventDefault();
      }
      return;
    }
    const index = entries.indexOf(entry);
    if (event.key === nextKey || event.key === prevKey) {
      const step = event.key === nextKey ? 1 : -1;
      entries[(index + step + entries.length) % entries.length].focusable.focus();
      event.preventDefault();
    } else if (event.key === 'Home' || event.key === 'End') {
      entries[event.key === 'Home' ? 0 : entries.length - 1].focusable.focus();
      event.preventDefault();
    } else if (!vertical && event.key === 'ArrowDown' && entry.trigger && entry.content) {
      set(entry.value);
      entry.content.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus();
      event.preventDefault();
    }
  });

  cleanup.listen(root, 'focusout', (event: FocusEvent) => {
    if (!root.contains(event.relatedTarget as Node | null)) set('');
  });
  const outside = (event: PointerEvent) => {
    if (value && !root.contains(event.target as Node)) set('');
  };
  cleanup.listen(document, 'pointerdown', outside);
  cleanup.add(clear);

  read();
  sync();

  return {
    get value() {
      return value;
    },
    setValue: set,
    refresh() {
      read();
      sync();
    },
    destroy: () => cleanup.run(),
  };
}
