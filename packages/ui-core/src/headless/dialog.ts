import { createDismissableLayer, type DismissableLayerHandle, type DismissableLayerReason } from '../primitives/dismissable-layer';
import { createFocusScope, type FocusScopeHandle } from '../primitives/focus-scope';
import { acquireBodyScrollLock } from '../scroll-lock';
import { createCleanup, ensureId, setState } from './shared';

export type DialogChangeReason = 'trigger' | 'api' | DismissableLayerReason;

export interface DialogOptions {
  /** The dialog panel: your own element, styled however you like. */
  content: HTMLElement;
  /** The button that opens it (optional: open() works without one). */
  trigger?: HTMLElement | null;
  /** A backdrop shown and hidden with the panel (clicks on it count as outside). */
  overlay?: HTMLElement | null;
  /** Modal (default): focus is trapped, the rest of the page is inert, scrolling is locked. */
  modal?: boolean;
  /** `alertdialog` for a confirmation that needs an answer. */
  role?: 'dialog' | 'alertdialog';
  defaultOpen?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePointer?: boolean;
  /** Element to focus on open (default: the first focusable one, else the panel). */
  initialFocus?: HTMLElement | (() => HTMLElement | null) | null;
  lockScroll?: boolean;
  onOpenChange?: (open: boolean, reason: DialogChangeReason) => void;
}

export interface DialogController {
  readonly isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
  setOpen(open: boolean, reason?: DialogChangeReason): void;
  destroy(): void;
}

/**
 * Dialog behaviour on your own markup (WAI-ARIA dialog pattern): roles and labelling, focus moved in
 * and trapped, focus returned to the trigger, Escape and outside click, inert background, scroll
 * lock. The panel is shown and hidden with the `hidden` attribute; `data-state` is "open" or
 * "closed" on the panel and the trigger.
 *
 * The title is the element with `data-dialog-title` (or the first heading) inside the panel, the
 * description the one with `data-dialog-description`; buttons with `data-dialog-close` close it.
 */
export function createDialog(options: DialogOptions): DialogController {
  const { content, trigger = null, overlay = null } = options;
  const modal = options.modal !== false;
  const cleanup = createCleanup();
  let isOpen = false;
  let layer: DismissableLayerHandle | null = null;
  let scope: FocusScopeHandle | null = null;
  let releaseScroll: (() => void) | null = null;

  const id = ensureId(content, 'ui-dialog');
  content.setAttribute('role', options.role || 'dialog');
  if (modal) content.setAttribute('aria-modal', 'true');
  else content.removeAttribute('aria-modal');
  if (!content.hasAttribute('tabindex')) content.tabIndex = -1;
  const title = content.querySelector<HTMLElement>('[data-dialog-title]') || content.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6');
  if (title && !content.hasAttribute('aria-label') && !content.hasAttribute('aria-labelledby')) {
    content.setAttribute('aria-labelledby', ensureId(title, `${id}-title`));
  }
  const description = content.querySelector<HTMLElement>('[data-dialog-description]');
  if (description && !content.hasAttribute('aria-describedby')) content.setAttribute('aria-describedby', ensureId(description, `${id}-description`));
  if (trigger) {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', id);
    cleanup.listen(trigger, 'click', (event: MouseEvent) => {
      event.preventDefault();
      setOpen(!isOpen, 'trigger');
    });
  }
  cleanup.listen(content, 'click', (event: MouseEvent) => {
    const close = (event.target as Element | null)?.closest?.('[data-dialog-close]');
    if (close && content.contains(close)) setOpen(false, 'api');
  });

  const sync = () => {
    content.hidden = !isOpen;
    if (overlay) overlay.hidden = !isOpen;
    setState(isOpen ? 'open' : 'closed', content, trigger, overlay);
    trigger?.setAttribute('aria-expanded', String(isOpen));
  };

  function show(reason: DialogChangeReason) {
    isOpen = true;
    sync();
    // First, so an app can reveal what wraps the panel before focus moves into it.
    options.onOpenChange?.(true, reason);
    if (!isOpen) return;
    if (modal && options.lockScroll !== false) releaseScroll = acquireBodyScrollLock();
    layer = createDismissableLayer({
      node: content,
      trigger,
      modal,
      closeOnEscape: options.closeOnEscape !== false,
      closeOnPointerOutside: options.closeOnOutsidePointer !== false,
      closeOnFocusOutside: !modal,
      onDismiss: (why) => setOpen(false, why),
    });
    scope = createFocusScope({
      node: content,
      trapped: modal,
      loop: true,
      restoreFocus: true,
      autoFocus: 'first',
      initialFocus: options.initialFocus ?? null,
      finalFocus: trigger,
      inertOthers: modal,
    });
    // A wrapper still hidden when the scope focused (a framework render pending): try again once
    // it can be seen.
    const retry = () => {
      if (isOpen && scope && !content.contains(document.activeElement)) scope.focusInitial();
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(retry);
    setTimeout(retry, 60);
  }

  function hide(reason: DialogChangeReason) {
    isOpen = false;
    layer?.destroy();
    layer = null;
    scope?.destroy();
    scope = null;
    releaseScroll?.();
    releaseScroll = null;
    sync();
    options.onOpenChange?.(false, reason);
  }

  function setOpen(next: boolean, reason: DialogChangeReason = 'api') {
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
    destroy() {
      if (isOpen) {
        layer?.destroy();
        scope?.destroy();
        releaseScroll?.();
      }
      layer = null;
      scope = null;
      releaseScroll = null;
      cleanup.run();
    },
  };
}
