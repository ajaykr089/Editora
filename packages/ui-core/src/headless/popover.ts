import { createDismissableLayer, type DismissableLayerHandle, type DismissableLayerReason } from '../primitives/dismissable-layer';
import { createFocusScope, type FocusScopeHandle } from '../primitives/focus-scope';
import { createPositioner, type PositionerHandle, type PositionerPlacement } from '../primitives/positioner';
import { createCleanup, ensureId, setState } from './shared';

export type PopoverChangeReason = 'trigger' | 'api' | DismissableLayerReason;

export interface PopoverOptions {
  trigger: HTMLElement;
  /** The floating panel: your own element. */
  content: HTMLElement;
  placement?: PositionerPlacement;
  /** Gap between trigger and panel, px (default 8). */
  offset?: number;
  /** Panel at least as wide as the trigger. */
  matchWidth?: boolean;
  defaultOpen?: boolean;
  /** Move focus into the panel on open (default true). */
  autoFocus?: boolean;
  onOpenChange?: (open: boolean, reason: PopoverChangeReason) => void;
}

export interface PopoverController {
  readonly isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
  setOpen(open: boolean, reason?: PopoverChangeReason): void;
  /** Re-measures the position (after the panel's content changed size). */
  update(): void;
  destroy(): void;
}

/**
 * Popover behaviour on your own markup: a non-modal dialog anchored to its trigger. Positioned
 * (flip and shift to stay in view), dismissed by Escape, a click outside or focus leaving it, focus
 * returned to the trigger. `data-state` and `data-side` ("top", "bottom"…) are set for styling.
 */
export function createPopover(options: PopoverOptions): PopoverController {
  const { trigger, content } = options;
  const cleanup = createCleanup();
  let isOpen = false;
  let layer: DismissableLayerHandle | null = null;
  let scope: FocusScopeHandle | null = null;
  let positioner: PositionerHandle | null = null;

  const id = ensureId(content, 'ui-popover');
  if (!content.hasAttribute('role')) content.setAttribute('role', 'dialog');
  if (!content.hasAttribute('tabindex')) content.tabIndex = -1;
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', id);
  cleanup.listen(trigger, 'click', (event: MouseEvent) => {
    event.preventDefault();
    setOpen(!isOpen, 'trigger');
  });

  const sync = () => {
    content.hidden = !isOpen;
    setState(isOpen ? 'open' : 'closed', content, trigger);
    trigger.setAttribute('aria-expanded', String(isOpen));
  };

  function show(reason: PopoverChangeReason) {
    isOpen = true;
    sync();
    options.onOpenChange?.(true, reason);
    if (!isOpen) return;
    positioner = createPositioner({
      anchor: trigger,
      floating: content,
      placement: options.placement || 'bottom-start',
      strategy: 'fixed',
      offset: options.offset ?? 8,
      flip: true,
      shift: true,
      matchWidth: options.matchWidth,
    });
    const state = positioner.update();
    if (state && (state as { placement?: string }).placement) {
      content.setAttribute('data-side', String((state as { placement: string }).placement).split('-')[0]);
    }
    layer = createDismissableLayer({
      node: content,
      trigger,
      closeOnEscape: true,
      closeOnPointerOutside: true,
      closeOnFocusOutside: true,
      onDismiss: (why) => setOpen(false, why),
    });
    scope = createFocusScope({
      node: content,
      trapped: false,
      restoreFocus: true,
      autoFocus: options.autoFocus === false ? 'none' : 'first',
      finalFocus: trigger,
    });
    if (options.autoFocus !== false) {
      const retry = () => {
        if (isOpen && scope && !content.contains(document.activeElement)) scope.focusInitial();
      };
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(retry);
      setTimeout(retry, 60);
    }
  }

  function hide(reason: PopoverChangeReason) {
    isOpen = false;
    layer?.destroy();
    scope?.destroy();
    positioner?.destroy();
    layer = null;
    scope = null;
    positioner = null;
    sync();
    options.onOpenChange?.(false, reason);
  }

  function setOpen(next: boolean, reason: PopoverChangeReason = 'api') {
    if (next === isOpen) return;
    if (next) show(reason);
    else hide(reason);
  }

  sync();
  if (options.defaultOpen) setOpen(true, 'api');

  return {
    get isOpen() {
      return isOpen;
    },
    open: () => setOpen(true, 'api'),
    close: () => setOpen(false, 'api'),
    toggle: () => setOpen(!isOpen, 'api'),
    setOpen,
    update: () => {
      positioner?.update();
    },
    destroy() {
      layer?.destroy();
      scope?.destroy();
      positioner?.destroy();
      layer = null;
      scope = null;
      positioner = null;
      cleanup.run();
    },
  };
}
