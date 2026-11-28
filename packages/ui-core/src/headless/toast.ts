import { createCleanup, setState } from './shared';

export interface ToasterOptions {
  /** Where the toasts go: a `<section>` (or `<div>`) becomes a labelled landmark; an `<ol>`/`<ul>` is labelled but stays a list. */
  region: HTMLElement;
  /** Accessible name of the region (default "Notifications"); the hotkey is added to it. */
  label?: string;
  /** Keys that move focus to the region (default F8). */
  hotkey?: string[];
  /** Default time on screen, ms (default 5000; Infinity keeps toasts until dismissed). */
  duration?: number;
  /** Swipe direction that dismisses (default right; mirrored in RTL). */
  swipeDirection?: 'left' | 'right' | 'up' | 'down';
  /** px of swipe that dismisses (default 50). */
  swipeThreshold?: number;
  /** A toast was dismissed (timer, close button, Escape, swipe or `dismiss()`): remove it here. By default the element is removed when its exit animation ends. */
  onDismiss?: (toast: HTMLElement, id: string) => void;
}

export interface ToastAddOptions {
  duration?: number;
  /** `foreground` (default) announces assertively, `background` politely. */
  type?: 'foreground' | 'background';
}

export interface ToasterController {
  /** Shows a toast element you rendered inside the region. Returns its id. */
  add(toast: HTMLElement, options?: ToastAddOptions): string;
  dismiss(id: string): void;
  dismissAll(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
}

const VISUALLY_HIDDEN = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';

let counter = 0;

/**
 * Toast behaviour on your own markup: a labelled region reached with F8; each toast's text is read
 * out through live regions created up front (so it is announced reliably); timers pause while the
 * pointer or focus is in the region and while the window is in the background; Escape dismisses the
 * focused toast, `[data-toast-close]` buttons dismiss theirs, and a swipe dismisses on touch and
 * mouse. Toasts get `data-state` "open" / "closed" and `--toast-swipe` during a swipe.
 */
export function createToaster(options: ToasterOptions): ToasterController {
  const { region } = options;
  const cleanup = createCleanup();
  const hotkey = options.hotkey ?? ['F8'];
  const defaultDuration = options.duration ?? 5000;
  const threshold = options.swipeThreshold ?? 50;
  const label = options.label ?? 'Notifications';

  // A list keeps its list role (role="region" is not allowed on <ol>/<ul>): put it in a <section> for a landmark.
  if (region.tagName !== 'OL' && region.tagName !== 'UL') region.setAttribute('role', 'region');
  region.setAttribute('aria-label', `${label} (${hotkey.join('+').replace('Key', '')})`);
  region.tabIndex = -1;

  const live = (['polite', 'assertive'] as const).map((politeness) => {
    const el = document.createElement('div');
    el.setAttribute('aria-live', politeness);
    el.setAttribute('aria-atomic', 'true');
    el.setAttribute('data-toast-announcer', politeness);
    el.style.cssText = VISUALLY_HIDDEN;
    document.body.appendChild(el);
    cleanup.add(() => el.remove());
    return el;
  });

  type Entry = { id: string; el: HTMLElement; remaining: number; started: number; timer: ReturnType<typeof setTimeout> | null };
  const entries = new Map<string, Entry>();
  let paused = false;

  const announce = (el: HTMLElement, type: 'foreground' | 'background') => {
    const target = live[type === 'background' ? 0 : 1];
    target.textContent = '';
    const text = el.getAttribute('data-toast-announce') || spokenText(el);
    // A change after a tick is announced by every screen reader.
    setTimeout(() => {
      target.textContent = text;
    }, 50);
  };

  const startTimer = (entry: Entry) => {
    if (entry.timer || !Number.isFinite(entry.remaining) || paused) return;
    entry.started = Date.now();
    entry.timer = setTimeout(() => dismiss(entry.id), entry.remaining);
  };
  const stopTimer = (entry: Entry) => {
    if (!entry.timer) return;
    clearTimeout(entry.timer);
    entry.timer = null;
    entry.remaining -= Date.now() - entry.started;
  };

  function dismiss(id: string) {
    const entry = entries.get(id);
    if (!entry) return;
    if (entry.timer) clearTimeout(entry.timer);
    entries.delete(id);
    const { el } = entry;
    // Keep focus in the region when the focused toast goes.
    if (el.contains(document.activeElement)) {
      const next = [...entries.values()][0]?.el;
      (next ?? region).focus();
    }
    setState('closed', el);
    if (options.onDismiss) options.onDismiss(el, id);
    else {
      const animated = typeof getComputedStyle === 'function' && getComputedStyle(el).animationName !== 'none' && getComputedStyle(el).animationName !== '';
      if (animated) el.addEventListener('animationend', () => el.remove(), { once: true });
      else el.remove();
    }
  }

  const pause = () => {
    paused = true;
    entries.forEach(stopTimer);
  };
  const resume = () => {
    paused = false;
    entries.forEach(startTimer);
  };

  const idOf = (node: EventTarget | null) => {
    for (const entry of entries.values()) if (entry.el.contains(node as Node)) return entry.id;
    return null;
  };

  cleanup.listen(document, 'keydown', (event: KeyboardEvent) => {
    if (hotkey.includes(event.key) || hotkey.includes(event.code)) {
      event.preventDefault();
      ([...entries.values()][0]?.el ?? region).focus();
    }
  });
  cleanup.listen(region, 'keydown', (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    const id = idOf(event.target);
    if (id) {
      event.preventDefault();
      dismiss(id);
    }
  });
  cleanup.listen(region, 'click', (event: MouseEvent) => {
    const close = (event.target as HTMLElement).closest?.('[data-toast-close]');
    if (!close) return;
    const id = idOf(close);
    if (id) dismiss(id);
  });
  let hovering = false;
  let focused = false;
  let windowBlurred = false;
  const reconsider = () => (hovering || focused || windowBlurred ? pause() : resume());
  cleanup.listen(region, 'pointerenter', () => {
    hovering = true;
    reconsider();
  });
  cleanup.listen(region, 'pointerleave', () => {
    hovering = false;
    reconsider();
  });
  cleanup.listen(region, 'focusin', () => {
    focused = true;
    reconsider();
  });
  cleanup.listen(region, 'focusout', (event: FocusEvent) => {
    if (!region.contains(event.relatedTarget as Node | null)) {
      focused = false;
      reconsider();
    }
  });
  if (typeof window !== 'undefined') {
    const onBlur = () => {
      windowBlurred = true;
      reconsider();
    };
    const onFocus = () => {
      windowBlurred = false;
      reconsider();
    };
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    cleanup.add(() => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    });
  }

  // Swipe to dismiss.
  let swipe: { id: string; x: number; y: number; delta: number } | null = null;
  const axis = () => (options.swipeDirection === 'up' || options.swipeDirection === 'down' ? 'y' : 'x');
  const sign = () => {
    const dir = options.swipeDirection ?? 'right';
    const rtl = getComputedStyle(region).direction === 'rtl';
    if (dir === 'left') return rtl ? 1 : -1;
    if (dir === 'right') return rtl ? -1 : 1;
    return dir === 'down' ? 1 : -1;
  };
  cleanup.listen(region, 'pointerdown', (event: PointerEvent) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest?.('button, a, input, textarea, select')) return;
    const id = idOf(event.target);
    if (id) swipe = { id, x: event.clientX, y: event.clientY, delta: 0 };
  });
  cleanup.listen(region, 'pointermove', (event: PointerEvent) => {
    if (!swipe) return;
    const raw = axis() === 'x' ? event.clientX - swipe.x : event.clientY - swipe.y;
    // Only in the dismissing direction; the other way resists.
    swipe.delta = raw * sign() > 0 ? raw : raw / 4;
    const el = entries.get(swipe.id)?.el;
    if (el) {
      el.setAttribute('data-swipe', 'move');
      el.style.setProperty('--toast-swipe', `${swipe.delta}px`);
    }
  });
  const endSwipe = () => {
    if (!swipe) return;
    const { id, delta } = swipe;
    swipe = null;
    const el = entries.get(id)?.el;
    if (!el) return;
    if (delta * sign() >= threshold) {
      el.setAttribute('data-swipe', 'end');
      dismiss(id);
    } else {
      el.setAttribute('data-swipe', 'cancel');
      el.style.removeProperty('--toast-swipe');
    }
  };
  cleanup.listen(region, 'pointerup', endSwipe);
  cleanup.listen(region, 'pointercancel', endSwipe);

  return {
    add(el, addOptions = {}) {
      counter += 1;
      const id = el.getAttribute('data-toast-id') || `toast-${counter}`;
      el.setAttribute('data-toast-id', id);
      if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
      setState('open', el);
      const entry: Entry = { id, el, remaining: addOptions.duration ?? defaultDuration, started: 0, timer: null };
      entries.set(id, entry);
      announce(el, addOptions.type ?? 'foreground');
      startTimer(entry);
      return id;
    },
    dismiss,
    dismissAll() {
      [...entries.keys()].forEach(dismiss);
    },
    pause,
    resume,
    destroy() {
      entries.forEach((entry) => entry.timer && clearTimeout(entry.timer));
      entries.clear();
      cleanup.run();
    },
  };
}

/** The toast's text as one line: words of separate elements kept apart; close buttons and `aria-hidden` parts left out. */
function spokenText(el: HTMLElement): string {
  const parts: string[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (parent && parent.closest('[data-toast-close], [aria-hidden="true"]')) continue;
    parts.push(node.textContent || '');
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}
