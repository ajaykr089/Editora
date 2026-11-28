import { createCleanup, firstEnabled, isDisabled, lastEnabled, nextEnabled } from './shared';

export interface ToggleGroupOptions {
  /** Contains toggle buttons `[data-toggle-item]` with a `data-value`. */
  root: HTMLElement;
  /** single: one pressed (radio-like); multiple: any number (default single). */
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  orientation?: 'horizontal' | 'vertical';
  /** Arrow keys move between items (one tab stop). Default true. */
  rovingFocus?: boolean;
  onValueChange?: (value: string[]) => void;
}

export interface ToggleGroupController {
  readonly value: string[];
  setValue(value: string[]): void;
  refresh(): void;
  destroy(): void;
}

/**
 * Toggle group behaviour: buttons that stay pressed (bold / italic / underline; left / centre /
 * right). Multiple: each is a toggle button (aria-pressed). Single: the group is a radio group and
 * each item a radio (aria-checked), the pattern for "one of". One tab stop; arrows move. Items get
 * `data-state` "on" / "off".
 */
export function createToggleGroup(options: ToggleGroupOptions): ToggleGroupController {
  const { root } = options;
  const cleanup = createCleanup();
  const multiple = options.type === 'multiple';
  const roving = options.rovingFocus !== false;
  let items: HTMLElement[] = [];
  let value = new Set<string>(options.defaultValue || []);
  let focusIndex = -1;

  const valueOf = (item: HTMLElement) => item.getAttribute('data-value') || (item.textContent || '').trim();

  const read = () => {
    items = Array.from(root.querySelectorAll<HTMLElement>('[data-toggle-item]'));
    root.setAttribute('role', multiple ? 'group' : 'radiogroup');
    if (options.orientation) root.setAttribute('aria-orientation', options.orientation);
    for (const item of items) {
      if (multiple) item.removeAttribute('role');
      else item.setAttribute('role', 'radio');
    }
  };

  const sync = () => {
    const pressedIndex = items.findIndex((item) => value.has(valueOf(item)));
    const stop = focusIndex >= 0 ? focusIndex : pressedIndex >= 0 ? pressedIndex : firstEnabled(items);
    items.forEach((item, index) => {
      const on = value.has(valueOf(item));
      if (multiple) item.setAttribute('aria-pressed', String(on));
      else item.setAttribute('aria-checked', String(on));
      item.setAttribute('data-state', on ? 'on' : 'off');
      if (roving) item.tabIndex = index === stop ? 0 : -1;
    });
  };

  const toggle = (index: number) => {
    const item = items[index];
    if (!item || isDisabled(item)) return;
    const v = valueOf(item);
    if (multiple) {
      if (value.has(v)) value.delete(v);
      else value.add(v);
    } else if (value.has(v)) {
      value.clear();
    } else {
      value = new Set([v]);
    }
    focusIndex = index;
    sync();
    options.onValueChange?.([...value]);
  };

  cleanup.listen(root, 'click', (event: MouseEvent) => {
    const index = items.findIndex((item) => item.contains(event.target as Node));
    if (index >= 0) toggle(index);
  });
  cleanup.listen(root, 'keydown', (event: KeyboardEvent) => {
    if (!roving) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    const vertical = options.orientation === 'vertical';
    const rtl = getComputedStyle(root).direction === 'rtl';
    const next = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const prev = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    let target = -1;
    if (event.key === next) target = nextEnabled(items, index, 1);
    else if (event.key === prev) target = nextEnabled(items, index, -1);
    else if (event.key === 'Home') target = firstEnabled(items);
    else if (event.key === 'End') target = lastEnabled(items);
    else return;
    event.preventDefault();
    if (target < 0) return;
    focusIndex = target;
    sync();
    items[target].focus();
  });

  read();
  sync();

  return {
    get value() {
      return [...value];
    },
    setValue(next: string[]) {
      value = new Set(multiple ? next : next.slice(0, 1));
      sync();
    },
    refresh() {
      read();
      sync();
    },
    destroy: () => cleanup.run(),
  };
}
