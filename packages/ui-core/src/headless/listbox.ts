import { createCleanup, createTypeahead, ensureId, firstEnabled, isDisabled, isPrintableKey, lastEnabled, nextEnabled } from './shared';

export interface ListboxOptions {
  /** The list: your own element; its options are `[role="option"]` or `[data-option]`. */
  listbox: HTMLElement;
  multiple?: boolean;
  orientation?: 'vertical' | 'horizontal';
  /** Values (`data-value`, else the option's text) selected at first. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export interface ListboxController {
  readonly value: string[];
  setValue(value: string[]): void;
  refresh(): void;
  destroy(): void;
}

/**
 * Listbox behaviour on your own markup (WAI-ARIA listbox pattern): roles, aria-selected,
 * aria-multiselectable, one tab stop that arrows move (Home, End, typeahead), Space or click to
 * select (Space toggles in a multiple list, Shift+Arrow extends it). Options get `data-state`
 * "checked" / "unchecked" and `data-highlighted` while focused.
 */
export function createListbox(options: ListboxOptions): ListboxController {
  const { listbox } = options;
  const cleanup = createCleanup();
  const typeahead = createTypeahead();
  const multiple = !!options.multiple;
  const horizontal = options.orientation === 'horizontal';
  let items: HTMLElement[] = [];
  let selected = new Set<string>(options.defaultValue || []);
  let active = -1;

  const valueOf = (item: HTMLElement) => item.getAttribute('data-value') || (item.textContent || '').trim();

  const read = () => {
    items = Array.from(listbox.querySelectorAll<HTMLElement>('[role="option"], [data-option]'));
    listbox.setAttribute('role', 'listbox');
    if (multiple) listbox.setAttribute('aria-multiselectable', 'true');
    else listbox.removeAttribute('aria-multiselectable');
    listbox.setAttribute('aria-orientation', horizontal ? 'horizontal' : 'vertical');
    for (const item of items) {
      item.setAttribute('role', 'option');
      ensureId(item, 'ui-option');
    }
    if (!multiple && selected.size > 1) selected = new Set([...selected].slice(0, 1));
  };

  const sync = () => {
    const first = items.findIndex((item) => selected.has(valueOf(item)));
    const tabStop = active >= 0 ? active : first >= 0 ? first : firstEnabled(items);
    items.forEach((item, index) => {
      const on = selected.has(valueOf(item));
      item.setAttribute('aria-selected', String(on));
      item.setAttribute('data-state', on ? 'checked' : 'unchecked');
      item.tabIndex = index === tabStop ? 0 : -1;
      if (isDisabled(item)) item.setAttribute('aria-disabled', 'true');
    });
  };

  const emit = () => options.onValueChange?.([...selected]);

  const focusIndex = (index: number) => {
    if (index < 0) return;
    active = index;
    items.forEach((item, i) => item.toggleAttribute('data-highlighted', i === index));
    sync();
    items[index].focus();
    items[index].scrollIntoView?.({ block: 'nearest' });
  };

  const toggle = (index: number) => {
    const item = items[index];
    if (!item || isDisabled(item)) return;
    const value = valueOf(item);
    if (multiple) {
      if (selected.has(value)) selected.delete(value);
      else selected.add(value);
    } else {
      if (selected.has(value) && selected.size === 1) return;
      selected = new Set([value]);
    }
    sync();
    emit();
  };

  cleanup.listen(listbox, 'click', (event: MouseEvent) => {
    const index = items.findIndex((item) => item.contains(event.target as Node));
    if (index < 0) return;
    focusIndex(index);
    toggle(index);
  });
  cleanup.listen(listbox, 'keydown', (event: KeyboardEvent) => {
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next = horizontal ? 'ArrowRight' : 'ArrowDown';
    const prev = horizontal ? 'ArrowLeft' : 'ArrowUp';
    let target = -1;
    if (event.key === next) target = nextEnabled(items, index, 1, false);
    else if (event.key === prev) target = nextEnabled(items, index < 0 ? items.length : index, -1, false);
    else if (event.key === 'Home') target = firstEnabled(items);
    else if (event.key === 'End') target = lastEnabled(items);
    else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (index >= 0) toggle(index);
      return;
    } else if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey) && multiple) {
      event.preventDefault();
      selected = new Set(items.filter((item) => !isDisabled(item)).map(valueOf));
      sync();
      emit();
      return;
    } else if (isPrintableKey(event)) {
      target = typeahead(event.key, items, index);
    } else return;
    event.preventDefault();
    if (target < 0) return;
    focusIndex(target);
    // Single select follows focus; Shift+Arrow extends a multiple selection.
    if (!multiple) toggle(target);
    else if (event.shiftKey && !selected.has(valueOf(items[target]))) toggle(target);
  });
  cleanup.listen(listbox, 'focusout', (event: FocusEvent) => {
    if (!listbox.contains(event.relatedTarget as Node)) items.forEach((item) => item.removeAttribute('data-highlighted'));
  });

  read();
  sync();

  return {
    get value() {
      return [...selected];
    },
    setValue(value: string[]) {
      selected = new Set(multiple ? value : value.slice(0, 1));
      sync();
    },
    refresh() {
      read();
      sync();
    },
    destroy: () => cleanup.run(),
  };
}
