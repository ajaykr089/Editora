import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { createPositioner, type PositionerAnchor, type PositionerHandle, type PositionerPlacement } from '../primitives/positioner';
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

  const id = ensureId(menu, 'ui-menu');
  ensureId(trigger, 'ui-menu-trigger');
  if (!menu.hasAttribute('aria-label') && !menu.hasAttribute('aria-labelledby')) menu.setAttribute('aria-labelledby', trigger.id);
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-controls', id);

  const core = createMenuCore({
    menu,
    placement: options.placement || 'bottom-start',
    offset: options.offset ?? 6,
    closeOnSelect: options.closeOnSelect,
    onSelect: options.onSelect,
    onOpenChange: options.onOpenChange,
    dismissTrigger: trigger,
    onSync: (open) => {
      setState(open ? 'open' : 'closed', trigger);
      trigger.setAttribute('aria-expanded', String(open));
    },
  });

  cleanup.listen(trigger, 'click', (event: MouseEvent) => {
    event.preventDefault();
    if (core.isOpen) core.close(trigger);
    else core.open(trigger, 'first');
  });
  cleanup.listen(trigger, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      core.open(trigger, 'first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      core.open(trigger, 'last');
    }
  });

  return {
    get isOpen() {
      return core.isOpen;
    },
    open: (focus) => core.open(trigger, focus),
    close: () => core.close(trigger),
    refresh: core.refresh,
    destroy() {
      core.destroy();
      cleanup.run();
    },
  };
}

/** @internal Options of the menu behaviour shared by the menu button and the context menu. */
export interface MenuCoreOptions {
  menu: HTMLElement;
  placement: PositionerPlacement;
  offset: number;
  closeOnSelect?: boolean;
  onSelect?: (item: HTMLElement) => void;
  onOpenChange?: (open: boolean) => void;
  /** Pressing this element does not count as "outside" (the menu button toggles itself). */
  dismissTrigger?: HTMLElement;
  onSync?: (open: boolean) => void;
}

/** @internal The menu panel behaviour: items, keyboard, typeahead, positioning and dismissal. */
export function createMenuCore(options: MenuCoreOptions) {
  const { menu } = options;
  const cleanup = createCleanup();
  const typeahead = createTypeahead();
  let isOpen = false;
  let items: HTMLElement[] = [];
  let layer: DismissableLayerHandle | null = null;
  let positioner: PositionerHandle | null = null;
  let returnTo: HTMLElement | null = null;

  menu.setAttribute('role', 'menu');

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
    setState(isOpen ? 'open' : 'closed', menu);
    options.onSync?.(isOpen);
  };

  function open(anchor: PositionerAnchor, focus: 'first' | 'last' | 'menu' = 'first', focusReturn: HTMLElement | null = null) {
    readItems();
    returnTo = focusReturn ?? (anchor instanceof HTMLElement ? anchor : (document.activeElement as HTMLElement | null));
    if (isOpen) {
      positioner?.destroy();
      layer?.destroy();
    }
    isOpen = true;
    sync();
    positioner = createPositioner({ anchor, floating: menu, placement: options.placement, strategy: 'fixed', offset: options.offset, flip: true, shift: true });
    positioner.update();
    layer = createDismissableLayer({
      node: menu,
      trigger: options.dismissTrigger,
      closeOnEscape: true,
      closeOnPointerOutside: true,
      closeOnFocusOutside: true,
      onDismiss: (reason) => close(reason === 'escape-key' ? returnTo : null),
    });
    options.onOpenChange?.(true);
    if (focus === 'menu') {
      if (!menu.hasAttribute('tabindex')) menu.tabIndex = -1;
      menu.focus();
    } else {
      focusIndex(focus === 'last' ? lastEnabled(items) : firstEnabled(items));
    }
  }

  function close(focusTarget: HTMLElement | null = returnTo) {
    if (!isOpen) return;
    isOpen = false;
    layer?.destroy();
    positioner?.destroy();
    layer = null;
    positioner = null;
    items.forEach((item) => item.removeAttribute('data-highlighted'));
    sync();
    if (focusTarget) focusTarget.focus();
    options.onOpenChange?.(false);
  }

  function choose(item: HTMLElement) {
    if (isDisabled(item)) return;
    options.onSelect?.(item);
    if (options.closeOnSelect !== false) close(returnTo);
  }

  cleanup.listen(menu, 'keydown', (event: KeyboardEvent) => {
    const index = currentIndex();
    if (event.key === 'ArrowDown') focusIndex(nextEnabled(items, index, 1));
    else if (event.key === 'ArrowUp') focusIndex(nextEnabled(items, index < 0 ? items.length : index, -1));
    else if (event.key === 'Home') focusIndex(firstEnabled(items));
    else if (event.key === 'End') focusIndex(lastEnabled(items));
    else if (event.key === 'Tab') {
      close(null);
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
    close,
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
