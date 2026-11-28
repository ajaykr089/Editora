/** Helpers shared by the headless controllers. */

let counter = 0;

/** Gives `el` an id if it has none, and returns it. */
export function ensureId(el: HTMLElement, prefix: string): string {
  if (!el.id) {
    counter += 1;
    el.id = `${prefix}-${counter}`;
  }
  return el.id;
}

/** Sets `data-state` on each element: the styling hook (`[data-state="open"]`, Tailwind `data-[state=open]:`). */
export function setState(state: string, ...elements: Array<HTMLElement | null | undefined>): void {
  for (const el of elements) if (el) el.setAttribute('data-state', state);
}

export function isDisabled(el: Element): boolean {
  return el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true' || el.hasAttribute('data-disabled');
}

/** Builds a typeahead: call it with a printable key, get the index of the next item whose text starts with what was typed. */
export function createTypeahead(timeoutMs = 600) {
  let query = '';
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (key: string, items: HTMLElement[], currentIndex: number): number => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      query = '';
    }, timeoutMs);
    query += key.toLowerCase();
    // Repeating one letter cycles through the items that start with it.
    const cycling = query.length > 1 && query.split('').every((char) => char === query[0]);
    const needle = cycling ? query[0] : query;
    const start = cycling ? currentIndex + 1 : currentIndex >= 0 && needle.length > 1 ? currentIndex : currentIndex + 1;
    for (let offset = 0; offset < items.length; offset += 1) {
      const index = (start + offset) % items.length;
      const item = items[index];
      if (isDisabled(item)) continue;
      const text = (item.getAttribute('data-label') || item.textContent || '').trim().toLowerCase();
      if (text.startsWith(needle)) return index;
    }
    return -1;
  };
}

export function isPrintableKey(event: KeyboardEvent): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ';
}

/** Index of the next enabled item from `from` in `step` direction, wrapping when `wrap`. */
export function nextEnabled(items: HTMLElement[], from: number, step: 1 | -1, wrap = true): number {
  const count = items.length;
  if (!count) return -1;
  let index = from;
  for (let tries = 0; tries < count; tries += 1) {
    index += step;
    if (index < 0 || index >= count) {
      if (!wrap) return from;
      index = (index + count) % count;
    }
    if (!isDisabled(items[index])) return index;
  }
  return from;
}

export function firstEnabled(items: HTMLElement[]): number {
  return items.findIndex((item) => !isDisabled(item));
}

export function lastEnabled(items: HTMLElement[]): number {
  for (let index = items.length - 1; index >= 0; index -= 1) if (!isDisabled(items[index])) return index;
  return -1;
}

/** Collects cleanup functions and runs them once. */
export function createCleanup() {
  const fns: Array<() => void> = [];
  return {
    add(fn: () => void) {
      fns.push(fn);
    },
    listen<K extends keyof HTMLElementEventMap>(el: HTMLElement | Document, type: K | string, handler: (event: any) => void, options?: AddEventListenerOptions) {
      el.addEventListener(type, handler, options);
      fns.push(() => el.removeEventListener(type, handler, options));
    },
    run() {
      while (fns.length) {
        try {
          fns.pop()!();
        } catch {
          // keep tearing down
        }
      }
    },
  };
}
