import { createPositioner, type PositionerHandle, type PositionerPlacement } from '../primitives/positioner';
import { createCleanup, ensureId, setState } from './shared';

export interface TooltipOptions {
  trigger: HTMLElement;
  /** The tooltip: your own element (text, no interactive content). */
  content: HTMLElement;
  placement?: PositionerPlacement;
  offset?: number;
  /** Delay before showing on hover, ms (default 600). Focus shows it at once. */
  delay?: number;
  /** Delay before hiding after the pointer leaves, ms (default 150): time to move onto the tooltip. */
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
}

export interface TooltipController {
  readonly isOpen: boolean;
  show(): void;
  hide(): void;
  destroy(): void;
}

/**
 * Tooltip behaviour (WAI-ARIA tooltip pattern and WCAG 1.4.13): shown on hover after a delay and at
 * once on keyboard focus, hidden on blur, pointer leave and Escape; it stays while the pointer is
 * over it, so it can be read or zoomed. The trigger is described by it (aria-describedby) and it has
 * role="tooltip". Only one tooltip is open at a time.
 */
let openTooltip: { hide: () => void } | null = null;

export function createTooltip(options: TooltipOptions): TooltipController {
  const { trigger, content } = options;
  const cleanup = createCleanup();
  let isOpen = false;
  let showTimer: ReturnType<typeof setTimeout> | null = null;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;
  let positioner: PositionerHandle | null = null;
  const self = { hide: () => hide() };

  content.setAttribute('role', 'tooltip');
  const id = ensureId(content, 'ui-tooltip');
  const describedBy = (trigger.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
  if (!describedBy.includes(id)) trigger.setAttribute('aria-describedby', [...describedBy, id].join(' '));

  const clearTimers = () => {
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
    showTimer = null;
    hideTimer = null;
  };

  function show() {
    clearTimers();
    if (isOpen) return;
    if (openTooltip && openTooltip !== self) openTooltip.hide();
    openTooltip = self;
    isOpen = true;
    content.hidden = false;
    setState('open', trigger, content);
    positioner = createPositioner({ anchor: trigger, floating: content, placement: options.placement || 'top', strategy: 'fixed', offset: options.offset ?? 6, flip: true, shift: true });
    positioner.update();
    options.onOpenChange?.(true);
  }

  function hide() {
    clearTimers();
    if (!isOpen) return;
    isOpen = false;
    if (openTooltip === self) openTooltip = null;
    positioner?.destroy();
    positioner = null;
    content.hidden = true;
    setState('closed', trigger, content);
    options.onOpenChange?.(false);
  }

  const scheduleShow = () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = null;
    if (isOpen || showTimer) return;
    showTimer = setTimeout(show, options.delay ?? 600);
  };
  const scheduleHide = () => {
    if (showTimer) clearTimeout(showTimer);
    showTimer = null;
    if (!isOpen) return;
    hideTimer = setTimeout(hide, options.closeDelay ?? 150);
  };

  cleanup.listen(trigger, 'pointerenter', (event: PointerEvent) => {
    if (event.pointerType !== 'touch') scheduleShow();
  });
  cleanup.listen(trigger, 'pointerleave', scheduleHide);
  cleanup.listen(content, 'pointerenter', () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = null;
  });
  cleanup.listen(content, 'pointerleave', scheduleHide);
  cleanup.listen(trigger, 'focus', () => {
    // Keyboard focus shows it at once; a mouse click that focuses does not re-open it.
    if (trigger.matches(':focus-visible')) show();
  });
  cleanup.listen(trigger, 'blur', hide);
  cleanup.listen(trigger, 'pointerdown', hide);
  cleanup.listen(document, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) hide();
  });

  content.hidden = true;
  setState('closed', trigger, content);

  return {
    get isOpen() {
      return isOpen;
    },
    show,
    hide,
    destroy() {
      hide();
      cleanup.run();
    },
  };
}
