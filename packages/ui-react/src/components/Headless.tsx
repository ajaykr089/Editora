import * as React from 'react';
import {
  createDialog,
  createListbox,
  createMenu,
  createPopover,
  createTabs,
  type DialogController,
  type ListboxController,
  type MenuController,
  type PopoverController,
  type TabsController,
} from '@editora/ui-core/headless';
import { useIsomorphicLayoutEffect } from './_internals';

/**
 * Headless hooks: the WAI-ARIA behaviour of ui-core's headless controllers on your own JSX and
 * styles (Tailwind, CSS modules, anything). Each hook returns callback refs to put on your
 * elements and the current state; the elements get roles, keyboard handling, focus management and
 * `data-state` for styling.
 *
 *   const dialog = useHeadlessDialog();
 *   <button ref={dialog.triggerRef}>Open</button>
 *   <div ref={dialog.contentRef} hidden className="fixed inset-0 …">…</div>
 */

type ElementRef = (el: HTMLElement | null) => void;

function useElement(): [HTMLElement | null, ElementRef] {
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  return [el, React.useCallback((node: HTMLElement | null) => setEl(node), [])];
}

function useLatest<T>(value: T): React.MutableRefObject<T> {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}

/** State that is controlled when `value` is set, uncontrolled otherwise. */
function useControllable<T>(value: T | undefined, defaultValue: T): [T, (next: T) => void, boolean] {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  return [controlled ? (value as T) : inner, setInner, controlled];
}

// ---------------------------------------------------------------------------------------------------------------------

export type UseHeadlessDialogOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  role?: 'dialog' | 'alertdialog';
  closeOnEscape?: boolean;
  closeOnOutsidePointer?: boolean;
};

export type UseHeadlessDialogResult = {
  triggerRef: ElementRef;
  contentRef: ElementRef;
  open: boolean;
  setOpen: (open: boolean) => void;
};

/** Dialog behaviour (focus trap and return, Escape, outside click, inert background, scroll lock). */
export function useHeadlessDialog(options: UseHeadlessDialogOptions = {}): UseHeadlessDialogResult {
  const [trigger, triggerRef] = useElement();
  const [content, contentRef] = useElement();
  const [open, setInner, controlled] = useControllable(options.open, options.defaultOpen ?? false);
  const latest = useLatest({ options, open, controlled });
  const controller = React.useRef<DialogController | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!content) return undefined;
    const ctl = createDialog({
      content,
      trigger,
      modal: options.modal,
      role: options.role,
      closeOnEscape: options.closeOnEscape,
      closeOnOutsidePointer: options.closeOnOutsidePointer,
      defaultOpen: latest.current.open,
      onOpenChange: (next) => {
        if (!latest.current.controlled) setInner(next);
        latest.current.options.onOpenChange?.(next);
        // Controlled and the parent kept its value: put the element back.
        queueMicrotask(() => {
          if (latest.current.controlled && controller.current && controller.current.isOpen !== latest.current.open) {
            controller.current.setOpen(latest.current.open);
          }
        });
      },
    });
    controller.current = ctl;
    return () => {
      ctl.destroy();
      controller.current = null;
    };
  }, [content, trigger, options.modal, options.role, options.closeOnEscape, options.closeOnOutsidePointer]);

  useIsomorphicLayoutEffect(() => {
    if (controller.current && controller.current.isOpen !== open) controller.current.setOpen(open);
  }, [open]);

  const setOpen = React.useCallback((next: boolean) => {
    if (latest.current.controlled) latest.current.options.onOpenChange?.(next);
    else setInner(next);
  }, [latest, setInner]);

  return { triggerRef, contentRef, open, setOpen };
}

// ---------------------------------------------------------------------------------------------------------------------

export type UseHeadlessPopoverOptions = Omit<UseHeadlessDialogOptions, 'modal' | 'role' | 'closeOnEscape' | 'closeOnOutsidePointer'> & {
  placement?: Parameters<typeof createPopover>[0]['placement'];
  offset?: number;
  matchWidth?: boolean;
  autoFocus?: boolean;
};

/** Popover behaviour: positioned next to the trigger, dismissed by Escape, outside click or focus leaving. */
export function useHeadlessPopover(options: UseHeadlessPopoverOptions = {}): UseHeadlessDialogResult {
  const [trigger, triggerRef] = useElement();
  const [content, contentRef] = useElement();
  const [open, setInner, controlled] = useControllable(options.open, options.defaultOpen ?? false);
  const latest = useLatest({ options, open, controlled });
  const controller = React.useRef<PopoverController | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!content || !trigger) return undefined;
    const ctl = createPopover({
      trigger,
      content,
      placement: options.placement,
      offset: options.offset,
      matchWidth: options.matchWidth,
      autoFocus: options.autoFocus,
      defaultOpen: latest.current.open,
      onOpenChange: (next) => {
        if (!latest.current.controlled) setInner(next);
        latest.current.options.onOpenChange?.(next);
        queueMicrotask(() => {
          if (latest.current.controlled && controller.current && controller.current.isOpen !== latest.current.open) {
            controller.current.setOpen(latest.current.open);
          }
        });
      },
    });
    controller.current = ctl;
    return () => {
      ctl.destroy();
      controller.current = null;
    };
  }, [content, trigger, options.placement, options.offset, options.matchWidth, options.autoFocus]);

  useIsomorphicLayoutEffect(() => {
    if (controller.current && controller.current.isOpen !== open) controller.current.setOpen(open);
  }, [open]);

  const setOpen = React.useCallback((next: boolean) => {
    if (latest.current.controlled) latest.current.options.onOpenChange?.(next);
    else setInner(next);
  }, [latest, setInner]);

  return { triggerRef, contentRef, open, setOpen };
}

// ---------------------------------------------------------------------------------------------------------------------

export type UseHeadlessMenuOptions = {
  onSelect?: (item: HTMLElement) => void;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  placement?: Parameters<typeof createMenu>[0]['placement'];
  offset?: number;
};

export type UseHeadlessMenuResult = {
  triggerRef: ElementRef;
  menuRef: ElementRef;
  open: boolean;
  /** Call after rendering a different set of items. */
  refresh: () => void;
  close: () => void;
};

/** Menu button behaviour: arrows, Home/End, typeahead, Escape and Tab, focus return. Items: `role="menuitem"` or `data-menu-item`. */
export function useHeadlessMenu(options: UseHeadlessMenuOptions = {}): UseHeadlessMenuResult {
  const [trigger, triggerRef] = useElement();
  const [menu, menuRef] = useElement();
  const [open, setOpen] = React.useState(false);
  const latest = useLatest(options);
  const controller = React.useRef<MenuController | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!trigger || !menu) return undefined;
    const ctl = createMenu({
      trigger,
      menu,
      placement: options.placement,
      offset: options.offset,
      closeOnSelect: options.closeOnSelect,
      onSelect: (item) => latest.current.onSelect?.(item),
      onOpenChange: (next) => {
        setOpen(next);
        latest.current.onOpenChange?.(next);
      },
    });
    controller.current = ctl;
    return () => {
      ctl.destroy();
      controller.current = null;
    };
  }, [trigger, menu, options.placement, options.offset, options.closeOnSelect]);

  return {
    triggerRef,
    menuRef,
    open,
    refresh: React.useCallback(() => controller.current?.refresh(), []),
    close: React.useCallback(() => controller.current?.close(), []),
  };
}

// ---------------------------------------------------------------------------------------------------------------------

export type UseHeadlessTabsOptions = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activation?: 'automatic' | 'manual';
};

export type UseHeadlessTabsResult = {
  /** On the element around the tabs (`data-tab` or `role="tab"` children). */
  tablistRef: ElementRef;
  value: string;
  setValue: (value: string) => void;
  refresh: () => void;
};

/** Tabs behaviour. Panels (`data-panel` or `role="tabpanel"`) are found next to the tablist, in tab order or by `data-value`. */
export function useHeadlessTabs(options: UseHeadlessTabsOptions = {}): UseHeadlessTabsResult {
  const [tablist, tablistRef] = useElement();
  const [value, setInner, controlled] = useControllable(options.value, options.defaultValue ?? '');
  const latest = useLatest({ options, value, controlled });
  const controller = React.useRef<TabsController | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!tablist) return undefined;
    const ctl = createTabs({
      tablist,
      orientation: options.orientation,
      activation: options.activation,
      defaultValue: latest.current.value || undefined,
      onValueChange: (next) => {
        if (!latest.current.controlled) setInner(next);
        latest.current.options.onValueChange?.(next);
        queueMicrotask(() => {
          if (latest.current.controlled && controller.current && controller.current.value !== latest.current.value) {
            controller.current.setValue(latest.current.value);
          }
        });
      },
    });
    controller.current = ctl;
    if (!latest.current.controlled && !latest.current.value) setInner(ctl.value);
    return () => {
      ctl.destroy();
      controller.current = null;
    };
  }, [tablist, options.orientation, options.activation]);

  useIsomorphicLayoutEffect(() => {
    if (controller.current && value && controller.current.value !== value) controller.current.setValue(value);
  }, [value]);

  const setValue = React.useCallback((next: string) => {
    if (latest.current.controlled) latest.current.options.onValueChange?.(next);
    else setInner(next);
  }, [latest, setInner]);

  return { tablistRef, value, setValue, refresh: React.useCallback(() => controller.current?.refresh(), []) };
}

// ---------------------------------------------------------------------------------------------------------------------

export type UseHeadlessListboxOptions = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  orientation?: 'vertical' | 'horizontal';
};

export type UseHeadlessListboxResult = {
  /** On the list (`data-option` or `role="option"` children, with `data-value`). */
  listboxRef: ElementRef;
  value: string[];
  setValue: (value: string[]) => void;
  refresh: () => void;
};

/** Listbox behaviour: arrows, Home/End, typeahead, Space/click to select, multiple with Shift+Arrow and Ctrl+A. */
export function useHeadlessListbox(options: UseHeadlessListboxOptions = {}): UseHeadlessListboxResult {
  const [listbox, listboxRef] = useElement();
  const [value, setInner, controlled] = useControllable(options.value, options.defaultValue ?? []);
  const latest = useLatest({ options, value, controlled });
  const controller = React.useRef<ListboxController | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!listbox) return undefined;
    const ctl = createListbox({
      listbox,
      multiple: options.multiple,
      orientation: options.orientation,
      defaultValue: latest.current.value,
      onValueChange: (next) => {
        if (!latest.current.controlled) setInner(next);
        latest.current.options.onValueChange?.(next);
        queueMicrotask(() => {
          if (latest.current.controlled && controller.current && controller.current.value.join('\u0000') !== latest.current.value.join('\u0000')) {
            controller.current.setValue(latest.current.value);
          }
        });
      },
    });
    controller.current = ctl;
    return () => {
      ctl.destroy();
      controller.current = null;
    };
  }, [listbox, options.multiple, options.orientation]);

  useIsomorphicLayoutEffect(() => {
    if (controller.current && controller.current.value.join('\u0000') !== value.join('\u0000')) controller.current.setValue(value);
  }, [value.join('\u0000')]);

  const setValue = React.useCallback((next: string[]) => {
    if (latest.current.controlled) latest.current.options.onValueChange?.(next);
    else setInner(next);
  }, [latest, setInner]);

  return { listboxRef, value, setValue, refresh: React.useCallback(() => controller.current?.refresh(), []) };
}
