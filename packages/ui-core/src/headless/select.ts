import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { createPositioner, type PositionerHandle, type PositionerPlacement } from '../primitives/positioner';
import { createHiddenInput, onFormReset } from './form';
import { createCleanup, createTypeahead, ensureId, firstEnabled, isDisabled, isPrintableKey, lastEnabled, nextEnabled, setState } from './shared';

export interface SelectOptions {
  /** A `<button>`; an element inside it with `data-select-value` shows the chosen option's text. */
  trigger: HTMLElement;
  /** The popup list: options are `[data-option]` (or `[role="option"]`) with a `data-value`. */
  listbox: HTMLElement;
  defaultValue?: string;
  /** Shown in `[data-select-value]` while nothing is chosen. */
  placeholder?: string;
  placement?: PositionerPlacement;
  offset?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export interface SelectController {
  readonly value: string;
  readonly isOpen: boolean;
  setValue(value: string): void;
  open(): void;
  close(): void;
  refresh(): void;
  setDisabled(disabled: boolean): void;
  destroy(): void;
}

/**
 * Select behaviour, the WAI-ARIA "select-only combobox": focus stays on the trigger
 * (`role="combobox"`) and `aria-activedescendant` follows the active option. Closed: Arrow keys,
 * Enter and Space open; typing jumps to a matching option. Open: arrows, Home/End and typing move;
 * Enter, Space or a click choose; Escape closes; Tab chooses the active option and moves on.
 * Options get `aria-selected`, the active one `data-highlighted`.
 */
export function createSelect(options: SelectOptions): SelectController {
  const { trigger, listbox } = options;
  const cleanup = createCleanup();
  const typeahead = createTypeahead();
  const initial = options.defaultValue ?? '';
  let value = initial;
  let isOpen = false;
  let disabled = !!options.disabled;
  let active = -1;
  let items: HTMLElement[] = [];
  let layer: DismissableLayerHandle | null = null;
  let positioner: PositionerHandle | null = null;
  const input = options.name ? createHiddenInput(trigger, 'hidden', options.name) : null;
  if (input) cleanup.add(() => input.remove());

  const listId = ensureId(listbox, 'ui-select-list');
  ensureId(trigger, 'ui-select');
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-controls', listId);
  if (trigger.tagName === 'BUTTON' && !trigger.hasAttribute('type')) trigger.setAttribute('type', 'button');
  if (options.required) trigger.setAttribute('aria-required', 'true');
  listbox.setAttribute('role', 'listbox');
  listbox.tabIndex = -1;
  if (!listbox.hasAttribute('aria-label') && !listbox.hasAttribute('aria-labelledby')) listbox.setAttribute('aria-labelledby', trigger.id);

  const valueOf = (item: HTMLElement) => item.getAttribute('data-value') || (item.textContent || '').trim();
  const read = () => {
    items = Array.from(listbox.querySelectorAll<HTMLElement>('[data-option], [role="option"]'));
    for (const item of items) {
      item.setAttribute('role', 'option');
      ensureId(item, 'ui-select-option');
      if (isDisabled(item)) item.setAttribute('aria-disabled', 'true');
    }
  };
  const selectedIndex = () => items.findIndex((item) => valueOf(item) === value);

  const sync = () => {
    listbox.hidden = !isOpen;
    setState(isOpen ? 'open' : 'closed', trigger, listbox);
    trigger.setAttribute('aria-expanded', String(isOpen));
    if (disabled) {
      trigger.setAttribute('aria-disabled', 'true');
      trigger.setAttribute('data-disabled', '');
    } else {
      trigger.removeAttribute('aria-disabled');
      trigger.removeAttribute('data-disabled');
    }
    items.forEach((item, index) => {
      const selected = valueOf(item) === value;
      item.setAttribute('aria-selected', String(selected));
      setState(selected ? 'checked' : 'unchecked', item);
      item.toggleAttribute('data-highlighted', isOpen && index === active);
    });
    if (isOpen && active >= 0) {
      trigger.setAttribute('aria-activedescendant', items[active].id);
      items[active].scrollIntoView?.({ block: 'nearest' });
    } else trigger.removeAttribute('aria-activedescendant');
    const shown = trigger.querySelector<HTMLElement>('[data-select-value]');
    const chosen = items[selectedIndex()];
    if (shown) {
      shown.textContent = chosen ? (chosen.getAttribute('data-label') || chosen.textContent || '').trim() : options.placeholder ?? '';
    }
    trigger.toggleAttribute('data-placeholder', !chosen);
    if (input) input.value = value;
  };

  const choose = (index: number) => {
    const item = items[index];
    if (!item || isDisabled(item)) return;
    const next = valueOf(item);
    const changed = next !== value;
    value = next;
    if (changed) options.onValueChange?.(value);
  };

  function open(at?: 'first' | 'last') {
    if (disabled) return;
    read();
    if (!isOpen) {
      isOpen = true;
      const selected = selectedIndex();
      active = at === 'first' ? firstEnabled(items) : at === 'last' ? lastEnabled(items) : selected >= 0 ? selected : firstEnabled(items);
      sync();
      positioner = createPositioner({ anchor: trigger, floating: listbox, placement: options.placement || 'bottom-start', strategy: 'fixed', offset: options.offset ?? 4, flip: true, shift: true });
      listbox.style.minWidth = `${trigger.getBoundingClientRect().width}px`;
      positioner.update();
      layer = createDismissableLayer({
        node: listbox,
        trigger,
        closeOnEscape: true,
        closeOnPointerOutside: true,
        closeOnFocusOutside: false,
        onDismiss: () => close(),
      });
      options.onOpenChange?.(true);
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    layer?.destroy();
    positioner?.destroy();
    layer = null;
    positioner = null;
    active = -1;
    sync();
    options.onOpenChange?.(false);
  }

  const move = (index: number) => {
    if (index < 0) return;
    active = index;
    sync();
  };

  // Space and Enter are handled on keydown; the button's own click that follows (detail 0) is ignored.
  let keyHandled = false;
  cleanup.listen(trigger, 'keyup', () => {
    setTimeout(() => {
      keyHandled = false;
    }, 0);
  });
  cleanup.listen(trigger, 'click', (event: MouseEvent) => {
    event.preventDefault();
    if (keyHandled && event.detail === 0) {
      keyHandled = false;
      return;
    }
    if (isOpen) close();
    else open();
  });
  cleanup.listen(trigger, 'keydown', (event: KeyboardEvent) => {
    if (disabled) return;
    if (event.key === ' ' || event.key === 'Enter') keyHandled = true;
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        open();
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        open(event.key === 'Home' ? 'first' : 'last');
      } else if (isPrintableKey(event)) {
        read();
        const index = typeahead(event.key, items, selectedIndex());
        if (index >= 0) {
          choose(index);
          sync();
        }
      }
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        if (event.altKey) {
          event.preventDefault();
          return;
        }
        move(nextEnabled(items, active, 1, false));
        break;
      case 'ArrowUp':
        if (event.altKey) {
          choose(active);
          close();
          break;
        }
        move(nextEnabled(items, active < 0 ? items.length : active, -1, false));
        break;
      case 'Home':
        move(firstEnabled(items));
        break;
      case 'End':
        move(lastEnabled(items));
        break;
      case 'PageDown':
        move(Math.min(lastEnabled(items), active + 10));
        break;
      case 'PageUp':
        move(Math.max(firstEnabled(items), active - 10));
        break;
      case 'Enter':
      case ' ':
        choose(active);
        close();
        break;
      case 'Tab':
        choose(active);
        close();
        return;
      default:
        if (isPrintableKey(event)) move(typeahead(event.key, items, active));
        else return;
    }
    event.preventDefault();
  });
  // Keep focus on the trigger while the pointer chooses.
  cleanup.listen(listbox, 'pointerdown', (event: PointerEvent) => event.preventDefault());
  cleanup.listen(listbox, 'click', (event: MouseEvent) => {
    const index = items.findIndex((item) => item.contains(event.target as Node));
    if (index < 0 || isDisabled(items[index])) return;
    choose(index);
    close();
    trigger.focus();
  });
  cleanup.listen(listbox, 'pointermove', (event: PointerEvent) => {
    const index = items.findIndex((item) => item.contains(event.target as Node));
    if (index >= 0 && index !== active && !isDisabled(items[index])) move(index);
  });
  cleanup.add(onFormReset(trigger, () => {
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
    get isOpen() {
      return isOpen;
    },
    setValue(next) {
      value = next;
      sync();
    },
    open: () => open(),
    close,
    refresh() {
      read();
      sync();
    },
    setDisabled(next) {
      disabled = next;
      if (disabled) close();
      sync();
    },
    destroy() {
      layer?.destroy();
      positioner?.destroy();
      cleanup.run();
    },
  };
}
