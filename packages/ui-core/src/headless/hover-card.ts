import { createPositioner, type PositionerHandle, type PositionerPlacement } from '../primitives/positioner';
import { createCleanup, setState } from './shared';

export interface HoverCardOptions {
  /** Usually a link: the card previews what it points to. */
  trigger: HTMLElement;
  content: HTMLElement;
  placement?: PositionerPlacement;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
}

export interface HoverCardController {
  readonly isOpen: boolean;
  show(): void;
  hide(): void;
  destroy(): void;
}

/**
 * Hover card behaviour: a preview for sighted pointer users (a profile behind an @mention, a page
 * behind a link), opened after a delay on hover or keyboard focus and kept open while the pointer is
 * over the card; Escape closes it. It is supplementary, so it is hidden from assistive technology
 * (`aria-hidden`): what it shows must also be reachable by following the trigger.
 */
export function createHoverCard(options: HoverCardOptions): HoverCardController {
  const { trigger, content } = options;
  const cleanup = createCleanup();
  let isOpen = false;
  let openTimer: ReturnType<typeof setTimeout> | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  let positioner: PositionerHandle | null = null;

  content.setAttribute('aria-hidden', 'true');
  const clear = () => {
    if (openTimer) clearTimeout(openTimer);
    if (closeTimer) clearTimeout(closeTimer);
    openTimer = null;
    closeTimer = null;
  };

  function show() {
    clear();
    if (isOpen) return;
    isOpen = true;
    content.hidden = false;
    setState('open', trigger, content);
    positioner = createPositioner({ anchor: trigger, floating: content, placement: options.placement || 'bottom', strategy: 'fixed', offset: options.offset ?? 8, flip: true, shift: true });
    positioner.update();
    options.onOpenChange?.(true);
  }

  function hide() {
    clear();
    if (!isOpen) return;
    isOpen = false;
    positioner?.destroy();
    positioner = null;
    content.hidden = true;
    setState('closed', trigger, content);
    options.onOpenChange?.(false);
  }

  const scheduleOpen = () => {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = null;
    if (!isOpen && !openTimer) openTimer = setTimeout(show, options.openDelay ?? 700);
  };
  const scheduleClose = () => {
    if (openTimer) clearTimeout(openTimer);
    openTimer = null;
    if (isOpen) closeTimer = setTimeout(hide, options.closeDelay ?? 300);
  };

  for (const el of [trigger, content]) {
    cleanup.listen(el, 'pointerenter', (event: PointerEvent) => {
      if (event.pointerType !== 'touch') scheduleOpen();
    });
    cleanup.listen(el, 'pointerleave', scheduleClose);
  }
  cleanup.listen(trigger, 'focus', scheduleOpen);
  cleanup.listen(trigger, 'blur', scheduleClose);
  cleanup.listen(document, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') hide();
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
