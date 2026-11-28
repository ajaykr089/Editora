import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { createPositioner, type PositionerHandle, type PositionerPlacement } from '../primitives/positioner';
import { createCleanup, createTypeahead, ensureId, firstEnabled, isDisabled, isPrintableKey, lastEnabled, nextEnabled, setState } from './shared';

export interface MenuOptions {
  trigger: HTMLElement;
  /** The menu panel: your own element; its items are `[role="menuitem"]` or `[data-menu-item]`. */
  menu: HTMLElement;
  placement?: PositionerPlacement;
  offset?: number;
  /** Called with the chosen item (click, Enter or Space). The menu then closes and focus returns. */
  onSelect?: (item: HTMLElement) => void;
  onOpenChange?: (open: boolean) => void;
  /** Keep the menu open after a choice (a menu of checkboxes). */
  closeOnSelect?: boolean;
}

export interface MenuController {
  readonly isOpen: boolean;
  /** Opens and focuses the first item (or the last with `focus: 'last'`). */
  open(focus?: 'first' | 'last'): void;
  close(): void;
  /** Re-reads the items (after adding or removing some). */
  refresh(): void;
  destroy(): void;
}

/**
 * Menu button behaviour on your own markup (WAI-ARIA menu button pattern): Enter, Space or Arrow
 * Down on the trigger opens and focuses the first item, Arrow Up the last; arrows move (wrapping),
 * Home and End jump, typing a letter finds an item, Escape closes and returns focus, Tab closes.
 * Disabled items (`aria-disabled="true"` or `disabled`) are skipped. `data-state` is set on the
 * trigger and the menu, `data-highlighted` on the focused item.
 */
export function createMenu(options: MenuOptions): MenuController {
  const { trigger, menu } = options;
  const cleanup = createCleanup();
  const typeahead = createTypeahead();
  let isOpen = false;
  let items: HTMLElement[] = [];
  let layer: DismissableLayerHandle | null = null;
  let positioner: PositionerHandle | null = null;

  const id = ensureId(menu, 'ui-menu');
  menu.setAttribute('role', 'menu');
  ensureId(trigger, 'ui-menu-trigger');
  if (!menu.hasAttribute('aria-label') && !menu.hasAttribute('aria-labelledby')) menu.setAttribute('aria-labelledby', trigger.id);
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-controls', id);

  const readItems = () => {
    items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [data-menu-item]'));
    for (const item of items) {
      if (!item.hasAttribute('role')) item.setAttribute('role', 'menuitem');
      item.tabIndex = -1;
    }
  };

  const focusIndex = (index: number) => {
    if (index < 0) return;
    items.forEach((item, i) => item.toggleAttribute('data-highlighted', i === index));
    items[index].focus();
  };

  const currentIndex = () => items.indexOf(document.activeElement as HTMLElement);

  const sync = () => {
    menu.hidden = !isOpen;
    setState(isOpen ? 'open' : 'closed', menu, trigger);
    trigger.setAttribute('aria-expanded', String(isOpen));
  };

  function open(focus: 'first' | 'last' = 'first') {
    readItems();
    if (!isOpen) {
      isOpen = true;
      sync();
      positioner = createPositioner({ anchor: trigger, floating: menu, placement: options.placement || 'bottom-start', strategy: 'fixed', offset: options.offset ?? 6, flip: true, shift: true });
      positioner.update();
      layer = createDismissableLayer({
        node: menu,
        trigger,
        closeOnEscape: true,
        closeOnPointerOutside: true,
        closeOnFocusOutside: true,
        onDismiss: (reason) => close(reason === 'escape-key'),
      });
      options.onOpenChange?.(true);
    }
    focusIndex(focus === 'last' ? lastEnabled(items) : firstEnabled(items));
  }

  function close(returnFocus = true) {
    if (!isOpen) return;
    isOpen = false;
    layer?.destroy();
    positioner?.destroy();
    layer = null;
    positioner = null;
    items.forEach((item) => item.removeAttribute('data-highlighted'));
    sync();
    if (returnFocus) trigger.focus();
    options.onOpenChange?.(false);
  }

  function choose(item: HTMLElement) {
    if (isDisabled(item)) return;
    options.onSelect?.(item);
    if (options.closeOnSelect !== false) close(true);
  }

  cleanup.listen(trigger, 'click', (event: MouseEvent) => {
    event.preventDefault();
    if (isOpen) close(true);
    else open('first');
  });
  cleanup.listen(trigger, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      open('last');
    }
  });
  cleanup.listen(menu, 'keydown', (event: KeyboardEvent) => {
    const index = currentIndex();
    if (event.key === 'ArrowDown') focusIndex(nextEnabled(items, index, 1));
    else if (event.key === 'ArrowUp') focusIndex(nextEnabled(items, index < 0 ? items.length : index, -1));
    else if (event.key === 'Home') focusIndex(firstEnabled(items));
    else if (event.key === 'End') focusIndex(lastEnabled(items));
    else if (event.key === 'Tab') {
      close(false);
      return;
    } else if ((event.key === 'Enter' || event.key === ' ') && index >= 0) {
      event.preventDefault();
      // A link item follows its href on Enter natively; the click does both.
      items[index].click();
      return;
    } else if (isPrintableKey(event)) {
      focusIndex(typeahead(event.key, items, index));
    } else return;
    event.preventDefault();
  });
  cleanup.listen(menu, 'click', (event: MouseEvent) => {
    const item = items.find((candidate) => candidate.contains(event.target as Node));
    if (item) choose(item);
  });
  cleanup.listen(menu, 'pointermove', (event: PointerEvent) => {
    const item = items.find((candidate) => candidate.contains(event.target as Node));
    if (item && !isDisabled(item) && document.activeElement !== item) focusIndex(items.indexOf(item));
  });

  readItems();
  sync();

  return {
    get isOpen() {
      return isOpen;
    },
    open,
    close: () => close(true),
    refresh: readItems,
    destroy() {
      layer?.destroy();
      positioner?.destroy();
      layer = null;
      positioner = null;
      cleanup.run();
    },
  };
}
