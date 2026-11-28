import { createCleanup, firstEnabled, isDisabled, lastEnabled, nextEnabled, setState } from './shared';
import { createHiddenInput, onFormReset } from './form';

export interface RadioGroupOptions {
  /** Contains `[data-radio-item]` elements (usually buttons) with a `data-value`. Give it an `aria-label` or `aria-labelledby`. */
  root: HTMLElement;
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  required?: boolean;
  /** Joins the surrounding form under this name. */
  name?: string;
  /** Arrow keys wrap from the last item to the first (default true). */
  loop?: boolean;
  onValueChange?: (value: string) => void;
}

export interface RadioGroupController {
  readonly value: string;
  setValue(value: string): void;
  refresh(): void;
  destroy(): void;
}

/**
 * Radio group behaviour: one tab stop on the checked item (or the first), arrow keys move focus and
 * check, Space checks the focused item. Items get `role="radio"`, `aria-checked` and `data-state`
 * "checked" / "unchecked".
 */
export function createRadioGroup(options: RadioGroupOptions): RadioGroupController {
  const { root } = options;
  const cleanup = createCleanup();
  const initial = options.defaultValue ?? '';
  let value = initial;
  let items: HTMLElement[] = [];
  const input = options.name ? createHiddenInput(root, 'hidden', options.name) : null;
  if (input) cleanup.add(() => input.remove());

  const valueOf = (item: HTMLElement) => item.getAttribute('data-value') || (item.textContent || '').trim();
  const off = (item: HTMLElement) => !!options.disabled || isDisabled(item);

  const read = () => {
    items = Array.from(root.querySelectorAll<HTMLElement>('[data-radio-item]'));
    root.setAttribute('role', 'radiogroup');
    if (options.orientation) root.setAttribute('aria-orientation', options.orientation);
    if (options.required) root.setAttribute('aria-required', 'true');
    if (options.disabled) root.setAttribute('aria-disabled', 'true');
    for (const item of items) {
      item.setAttribute('role', 'radio');
      if (item.tagName === 'BUTTON' && !item.hasAttribute('type')) item.setAttribute('type', 'button');
      if (options.disabled) item.setAttribute('data-disabled', '');
    }
  };

  const sync = () => {
    const checkedIndex = items.findIndex((item) => valueOf(item) === value && !off(item));
    const stop = checkedIndex >= 0 ? checkedIndex : items.findIndex((item) => !off(item));
    items.forEach((item, index) => {
      const on = valueOf(item) === value;
      item.setAttribute('aria-checked', String(on));
      setState(on ? 'checked' : 'unchecked', item);
      item.tabIndex = index === stop ? 0 : -1;
    });
    if (input) input.value = value;
  };

  const check = (index: number, notify: boolean) => {
    const item = items[index];
    if (!item || off(item)) return;
    const next = valueOf(item);
    if (next === value) return;
    value = next;
    sync();
    if (notify) options.onValueChange?.(value);
  };

  cleanup.listen(root, 'click', (event: MouseEvent) => {
    const index = items.findIndex((item) => item.contains(event.target as Node));
    if (index >= 0) check(index, true);
  });
  cleanup.listen(root, 'keydown', (event: KeyboardEvent) => {
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      check(index, true);
      return;
    }
    const rtl = getComputedStyle(root).direction === 'rtl';
    const wrap = options.loop !== false;
    // WAI-ARIA radio group: both arrow axes move, whatever the orientation.
    const forward = ['ArrowDown', rtl ? 'ArrowLeft' : 'ArrowRight'];
    const back = ['ArrowUp', rtl ? 'ArrowRight' : 'ArrowLeft'];
    // A group-level `disabled` counts every item as disabled for the shared helpers.
    const stops = items.map((item) => (off(item) ? disabledMarker() : item));
    let target = -1;
    if (forward.includes(event.key)) target = nextEnabled(stops, index, 1, wrap);
    else if (back.includes(event.key)) target = nextEnabled(stops, index, -1, wrap);
    else if (event.key === 'Home') target = firstEnabled(stops);
    else if (event.key === 'End') target = lastEnabled(stops);
    else return;
    event.preventDefault();
    if (target < 0 || target === index) return;
    items[target].focus();
    check(target, true);
  });
  cleanup.add(onFormReset(root, () => {
    value = initial;
    sync();
    options.onValueChange?.(value);
  }));

  read();
  sync();

  return {
    get value() {
      return value;
    },
    setValue(next) {
      value = next;
      sync();
    },
    refresh() {
      read();
      sync();
    },
    destroy: () => cleanup.run(),
  };
}

let marker: HTMLElement | null = null;
function disabledMarker(): HTMLElement {
  if (!marker) {
    marker = document.createElement('span');
    marker.setAttribute('disabled', '');
  }
  return marker;
}
