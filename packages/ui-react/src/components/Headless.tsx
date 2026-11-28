import * as React from 'react';
import {
  createDialog,
  createListbox,
  createMenu,
  createPopover,
  createTabs,
  createCollapsible,
  createAccordion,
  createTooltip,
  createHoverCard,
  createToggleGroup,
  createToolbar,
  type CollapsibleController,
  type AccordionController,
  type TooltipController,
  type HoverCardController,
  type ToggleGroupController,
  type ToolbarController,
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

// ---------------------------------------------------------------------------------------------------------------------

const sameList = (a: string[], b: string[]) => a.join('\u0000') === b.join('\u0000');

/** Wires a list-valued controller (accordion, toggle group) to controlled or uncontrolled React state. */
function useListController<C extends { value: string[]; setValue(v: string[]): void; refresh(): void; destroy(): void }>(
  root: HTMLElement | null,
  options: { value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void },
  create: (root: HTMLElement, defaultValue: string[], onValueChange: (next: string[]) => void) => C,
  deps: unknown[],
): { value: string[]; setValue: (value: string[]) => void; refresh: () => void } {
  const [value, setInner, controlled] = useControllable(options.value, options.defaultValue ?? []);
  const latest = useLatest({ options, value, controlled });
  const controller = React.useRef<C | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root) return undefined;
    const ctl = create(root, latest.current.value, (next) => {
      if (!latest.current.controlled) setInner(next);
      latest.current.options.onValueChange?.(next);
      queueMicrotask(() => {
        if (latest.current.controlled && controller.current && !sameList(controller.current.value, latest.current.value)) {
          controller.current.setValue(latest.current.value);
        }
      });
    });
    controller.current = ctl;
    return () => {
      ctl.destroy();
      controller.current = null;
    };
  }, [root, ...deps]);

  useIsomorphicLayoutEffect(() => {
    if (controller.current && !sameList(controller.current.value, value)) controller.current.setValue(value);
  }, [value.join('\u0000')]);

  const setValue = React.useCallback((next: string[]) => {
    if (latest.current.controlled) latest.current.options.onValueChange?.(next);
    else setInner(next);
  }, [latest, setInner]);

  return { value, setValue, refresh: React.useCallback(() => controller.current?.refresh(), []) };
}

// ---------------------------------------------------------------------------------------------------------------------

export type UseHeadlessCollapsibleOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

/** Disclosure behaviour: a button that shows and hides a region (`aria-expanded`, `aria-controls`, `hidden`). */
export function useHeadlessCollapsible(options: UseHeadlessCollapsibleOptions = {}): UseHeadlessDialogResult {
  const [trigger, triggerRef] = useElement();
  const [content, contentRef] = useElement();
  const [open, setInner, controlled] = useControllable(options.open, options.defaultOpen ?? false);
  const latest = useLatest({ options, open, controlled });
  const controller = React.useRef<CollapsibleController | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!trigger || !content) return undefined;
    const ctl = createCollapsible({
      trigger,
      content,
      disabled: options.disabled,
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
  }, [trigger, content, options.disabled]);

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

export type UseHeadlessAccordionOptions = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  orientation?: 'vertical' | 'horizontal';
};

export type UseHeadlessAccordionResult = {
  /** On the element around the items: `data-accordion-item` (with `data-value`), each holding a `data-accordion-trigger` button and a `data-accordion-content` panel. */
  rootRef: ElementRef;
  value: string[];
  setValue: (value: string[]) => void;
  /** Call after rendering a different set of items. */
  refresh: () => void;
};

/** Accordion behaviour: one or several sections open, arrows/Home/End between headers, labelled regions. */
export function useHeadlessAccordion(options: UseHeadlessAccordionOptions = {}): UseHeadlessAccordionResult {
  const [root, rootRef] = useElement();
  const state = useListController<AccordionController>(
    root,
    options,
    (el, defaultValue, onValueChange) => createAccordion({
      root: el,
      type: options.type,
      collapsible: options.collapsible,
      orientation: options.orientation,
      defaultValue,
      onValueChange,
    }),
    [options.type, options.collapsible, options.orientation],
  );
  return { rootRef, ...state };
}

// ---------------------------------------------------------------------------------------------------------------------

export type UseHeadlessTooltipOptions = {
  placement?: Parameters<typeof createTooltip>[0]['placement'];
  offset?: number;
  /** Hover delay before showing, ms (default 600). Keyboard focus shows it at once. */
  delay?: number;
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
};

export type UseHeadlessHoverResult = {
  triggerRef: ElementRef;
  contentRef: ElementRef;
  open: boolean;
  show: () => void;
  hide: () => void;
};

/** Tooltip behaviour: `role="tooltip"` + `aria-describedby`, hover with delay, focus-visible, Escape, hoverable, one at a time. */
export function useHeadlessTooltip(options: UseHeadlessTooltipOptions = {}): UseHeadlessHoverResult {
  return useHoverController<TooltipController>(options, (trigger, content, onOpenChange) => createTooltip({
    trigger,
    content,
    placement: options.placement,
    offset: options.offset,
    delay: options.delay,
    closeDelay: options.closeDelay,
    onOpenChange,
  }), [options.placement, options.offset, options.delay, options.closeDelay]);
}

export type UseHeadlessHoverCardOptions = {
  placement?: Parameters<typeof createHoverCard>[0]['placement'];
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
};

/** Hover card behaviour: a preview shown on hover or focus of a link, for sighted pointer users (hidden from assistive technology). */
export function useHeadlessHoverCard(options: UseHeadlessHoverCardOptions = {}): UseHeadlessHoverResult {
  return useHoverController<HoverCardController>(options, (trigger, content, onOpenChange) => createHoverCard({
    trigger,
    content,
    placement: options.placement,
    offset: options.offset,
    openDelay: options.openDelay,
    closeDelay: options.closeDelay,
    onOpenChange,
  }), [options.placement, options.offset, options.openDelay, options.closeDelay]);
}

function useHoverController<C extends { isOpen: boolean; show(): void; hide(): void; destroy(): void }>(
  options: { onOpenChange?: (open: boolean) => void },
  create: (trigger: HTMLElement, content: HTMLElement, onOpenChange: (open: boolean) => void) => C,
  deps: unknown[],
): UseHeadlessHoverResult {
  const [trigger, triggerRef] = useElement();
  const [content, contentRef] = useElement();
  const [open, setOpen] = React.useState(false);
  const latest = useLatest(options);
  const controller = React.useRef<C | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!trigger || !content) return undefined;
    const ctl = create(trigger, content, (next) => {
      setOpen(next);
      latest.current.onOpenChange?.(next);
    });
    controller.current = ctl;
    return () => {
      ctl.destroy();
      controller.current = null;
    };
  }, [trigger, content, ...deps]);

  return {
    triggerRef,
    contentRef,
    open,
    show: React.useCallback(() => controller.current?.show(), []),
    hide: React.useCallback(() => controller.current?.hide(), []),
  };
}

// ---------------------------------------------------------------------------------------------------------------------

export type UseHeadlessToggleGroupOptions = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  type?: 'single' | 'multiple';
  orientation?: 'horizontal' | 'vertical';
  rovingFocus?: boolean;
};

export type UseHeadlessToggleGroupResult = {
  /** On the element around the `data-toggle-item` buttons (each with a `data-value`). Give it an `aria-label`. */
  rootRef: ElementRef;
  value: string[];
  setValue: (value: string[]) => void;
  refresh: () => void;
};

/** Toggle group behaviour: single (radio group) or multiple (pressed buttons), one tab stop with arrow keys. */
export function useHeadlessToggleGroup(options: UseHeadlessToggleGroupOptions = {}): UseHeadlessToggleGroupResult {
  const [root, rootRef] = useElement();
  const state = useListController<ToggleGroupController>(
    root,
    options,
    (el, defaultValue, onValueChange) => createToggleGroup({
      root: el,
      type: options.type,
      orientation: options.orientation,
      rovingFocus: options.rovingFocus,
      defaultValue,
      onValueChange,
    }),
    [options.type, options.orientation, options.rovingFocus],
  );
  return { rootRef, ...state };
}

// ---------------------------------------------------------------------------------------------------------------------

export type UseHeadlessToolbarOptions = {
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
};

export type UseHeadlessToolbarResult = {
  /** On the toolbar element. Give it an `aria-label`. */
  rootRef: ElementRef;
  /** Call after rendering a different set of controls. */
  refresh: () => void;
};

/** Toolbar behaviour: `role="toolbar"`, one tab stop, arrow keys between controls (text inputs keep theirs). */
export function useHeadlessToolbar(options: UseHeadlessToolbarOptions = {}): UseHeadlessToolbarResult {
  const [root, rootRef] = useElement();
  const controller = React.useRef<ToolbarController | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root) return undefined;
    const ctl = createToolbar({ root, orientation: options.orientation, loop: options.loop });
    controller.current = ctl;
    return () => {
      ctl.destroy();
      controller.current = null;
    };
  }, [root, options.orientation, options.loop]);

  return { rootRef, refresh: React.useCallback(() => controller.current?.refresh(), []) };
}
