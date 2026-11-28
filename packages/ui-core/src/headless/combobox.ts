import { createPositioner, type PositionerHandle, type PositionerPlacement } from '../primitives/positioner';
import { createHiddenInput, onFormReset } from './form';
import { createCleanup, ensureId, firstEnabled, isDisabled, lastEnabled, nextEnabled, setState } from './shared';

export interface ComboboxOptions {
  /** The text input: it gets `role="combobox"` and keeps focus. */
  input: HTMLInputElement;
  /** The popup list: options are `[data-option]` (or `[role="option"]`) with a `data-value`. An element with `data-combobox-empty` inside it shows when nothing matches. */
  listbox: HTMLElement;
  /** `'auto'` (default) hides options whose text does not contain what was typed; `'none'` leaves filtering to you (call `refresh()` after rendering new options). */
  filter?: 'auto' | 'none';
  defaultValue?: string;
  /** Open the list when the input gains focus (default false). */
  openOnFocus?: boolean;
  placement?: PositionerPlacement;
  offset?: number;
  /** Joins the surrounding form with the chosen option's value. */
  name?: string;
  onValueChange?: (value: string) => void;
  onInputChange?: (text: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export interface ComboboxController {
  readonly value: string;
  readonly isOpen: boolean;
  setValue(value: string): void;
  open(): void;
  close(): void;
  refresh(): void;
  destroy(): void;
}

/**
 * Combobox behaviour (WAI-ARIA editable combobox with list autocomplete): typing opens the list and
 * filters it, Arrow Down/Up move the active option (`aria-activedescendant`, focus stays in the
 * input), Enter chooses it and puts its text in the input, Escape closes (and, when closed, clears
 * the text), Alt+Arrow Down opens without moving. Clicking an option chooses it.
 */
export function createCombobox(options: ComboboxOptions): ComboboxController {
  const { input, listbox } = options;
  const cleanup = createCleanup();
  const autoFilter = options.filter !== 'none';
  const initial = options.defaultValue ?? '';
  let value = initial;
  let isOpen = false;
  let active = -1;
  let all: HTMLElement[] = [];
  let visible: HTMLElement[] = [];
  let positioner: PositionerHandle | null = null;
  const hidden = options.name ? createHiddenInput(input, 'hidden', options.name) : null;
  if (hidden) cleanup.add(() => hidden.remove());

  const listId = ensureId(listbox, 'ui-combobox-list');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', listId);
  input.setAttribute('autocomplete', 'off');
  listbox.setAttribute('role', 'listbox');
  if (!listbox.hasAttribute('aria-label') && !listbox.hasAttribute('aria-labelledby')) {
    const label = input.labels?.[0];
    if (label) listbox.setAttribute('aria-labelledby', ensureId(label, 'ui-combobox-label'));
  }

  const valueOf = (item: HTMLElement) => item.getAttribute('data-value') || (item.textContent || '').trim();
  const textOf = (item: HTMLElement) => (item.getAttribute('data-label') || item.textContent || '').trim();
  const empty = () => listbox.querySelector<HTMLElement>('[data-combobox-empty]');

  const read = () => {
    all = Array.from(listbox.querySelectorAll<HTMLElement>('[data-option], [role="option"]'));
    for (const item of all) {
      item.setAttribute('role', 'option');
      ensureId(item, 'ui-combobox-option');
      if (isDisabled(item)) item.setAttribute('aria-disabled', 'true');
    }
  };

  const applyFilter = () => {
    const query = input.value.trim().toLowerCase();
    for (const item of all) {
      if (autoFilter) item.hidden = !!query && !textOf(item).toLowerCase().includes(query);
    }
    visible = all.filter((item) => !item.hidden);
    const none = empty();
    if (none) none.hidden = visible.length > 0;
    if (active >= visible.length) active = -1;
  };

  const sync = () => {
    listbox.hidden = !isOpen;
    setState(isOpen ? 'open' : 'closed', input, listbox);
    input.setAttribute('aria-expanded', String(isOpen));
    all.forEach((item) => {
      const selected = valueOf(item) === value;
      item.setAttribute('aria-selected', String(selected));
      setState(selected ? 'checked' : 'unchecked', item);
      item.toggleAttribute('data-highlighted', isOpen && visible[active] === item);
    });
    if (isOpen && visible[active]) {
      input.setAttribute('aria-activedescendant', visible[active].id);
      visible[active].scrollIntoView?.({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
    if (hidden) hidden.value = value;
  };

  function open() {
    read();
    applyFilter();
    if (!isOpen) {
      isOpen = true;
      positioner = createPositioner({ anchor: input, floating: listbox, placement: options.placement || 'bottom-start', strategy: 'fixed', offset: options.offset ?? 4, flip: true, shift: true });
      listbox.style.minWidth = `${input.getBoundingClientRect().width}px`;
      options.onOpenChange?.(true);
    }
    sync();
    positioner?.update();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    active = -1;
    positioner?.destroy();
    positioner = null;
    sync();
    options.onOpenChange?.(false);
  }

  const choose = (item: HTMLElement | undefined) => {
    if (!item || isDisabled(item)) return;
    const next = valueOf(item);
    input.value = textOf(item);
    const changed = next !== value;
    value = next;
    close();
    if (changed) options.onValueChange?.(value);
  };

  const move = (index: number) => {
    active = index;
    sync();
  };

  cleanup.listen(input, 'input', () => {
    options.onInputChange?.(input.value);
    active = -1;
    open();
    // Typing the start of an option makes it the active one, ready for Enter.
    if (input.value.trim() && visible.length) move(firstEnabled(visible));
  });
  cleanup.listen(input, 'keydown', (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        if (!isOpen) {
          open();
          if (!event.altKey) move(firstEnabled(visible));
        } else move(active < 0 ? firstEnabled(visible) : nextEnabled(visible, active, 1));
        break;
      case 'ArrowUp':
        if (!isOpen) {
          open();
          move(lastEnabled(visible));
        } else move(active < 0 ? lastEnabled(visible) : nextEnabled(visible, active, -1));
        break;
      case 'Enter':
        if (!isOpen || active < 0) return;
        choose(visible[active]);
        break;
      case 'Escape':
        if (isOpen) close();
        else if (input.value) {
          input.value = '';
          options.onInputChange?.('');
        } else return;
        break;
      case 'Home':
      case 'End':
        // The caret moves in the input; the list stays as it is.
        return;
      default:
        return;
    }
    event.preventDefault();
  });
  cleanup.listen(input, 'focus', () => {
    if (options.openOnFocus) open();
  });
  cleanup.listen(input, 'blur', () => {
    // A pointer press on the list keeps focus (prevented below), so blur means leaving.
    close();
  });
  cleanup.listen(listbox, 'pointerdown', (event: PointerEvent) => event.preventDefault());
  cleanup.listen(listbox, 'click', (event: MouseEvent) => {
    choose(visible.find((item) => item.contains(event.target as Node)));
  });
  cleanup.listen(listbox, 'pointermove', (event: PointerEvent) => {
    const index = visible.findIndex((item) => item.contains(event.target as Node));
    if (index >= 0 && index !== active && !isDisabled(visible[index])) move(index);
  });
  cleanup.add(onFormReset(input, () => {
    value = initial;
    read();
    const chosen = all.find((item) => valueOf(item) === value);
    input.value = chosen ? textOf(chosen) : '';
    applyFilter();
    sync();
  }));

  read();
  const chosen = all.find((item) => valueOf(item) === value);
  if (chosen && !input.value) input.value = textOf(chosen);
  applyFilter();
  sync();

  return {
    get value() {
      return value;
    },
    get isOpen() {
      return isOpen;
    },
    setValue(next) {
      value = next;
      read();
      const item = all.find((candidate) => valueOf(candidate) === next);
      if (item) input.value = textOf(item);
      sync();
    },
    open,
    close,
    refresh() {
      read();
      applyFilter();
      if (isOpen && active < 0 && input.value.trim() && visible.length) active = firstEnabled(visible);
      sync();
      positioner?.update();
    },
    destroy() {
      positioner?.destroy();
      cleanup.run();
    },
  };
}
