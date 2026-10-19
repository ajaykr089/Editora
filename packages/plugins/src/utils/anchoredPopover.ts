export interface AnchoredPopoverOptions {
  popover: HTMLElement;
  anchor: HTMLElement;
  onClose: () => void;
  gap?: number;
  margin?: number;
  zIndex?: number;
  /** Names the popover (it becomes a dialog) so a screen reader announces it when the focus moves in. */
  label?: string;
  /** Take the focus when the popover opens: a selector for the control to start on, else the first control. */
  initialFocus?: string;
}

export interface AnchoredPopoverHandle {
  reposition: () => void;
  destroy: () => void;
}

/**
 * Anchors a popover to an element with viewport clamping and auto-reposition.
 * Uses fixed positioning to avoid scroll offset drift across nested containers.
 */
export function attachAnchoredPopover({
  popover,
  anchor,
  onClose,
  gap = 6,
  margin = 8,
  zIndex = 10000,
  label,
  initialFocus,
}: AnchoredPopoverOptions): AnchoredPopoverHandle {
  popover.style.position = 'fixed';
  popover.style.zIndex = `${zIndex}`;
  popover.style.visibility = 'hidden';

  const reposition = () => {
    if (!popover.isConnected || !anchor.isConnected) {
      onClose();
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    if (anchorRect.width === 0 && anchorRect.height === 0) {
      // Hidden/virtualized anchor (for example overflow-hidden toolbar item).
      // Close instead of pinning popover to viewport origin.
      onClose();
      return;
    }
    const popoverRect = popover.getBoundingClientRect();
    const popoverWidth = popoverRect.width || popover.offsetWidth || 220;
    const popoverHeight = popoverRect.height || popover.offsetHeight || 260;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = anchorRect.left;
    let top = anchorRect.bottom + gap;

    if (left + popoverWidth > viewportWidth - margin) {
      left = viewportWidth - popoverWidth - margin;
    }
    left = Math.max(margin, left);

    if (top + popoverHeight > viewportHeight - margin) {
      const aboveTop = anchorRect.top - popoverHeight - gap;
      if (aboveTop >= margin) {
        top = aboveTop;
      } else {
        top = Math.max(margin, viewportHeight - popoverHeight - margin);
      }
    }

    if (top < margin) top = margin;

    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(top)}px`;
    popover.style.visibility = 'visible';
  };

  const handleViewportChange = () => {
    reposition();
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as Node | null;
    if (!target) return;
    if (popover.contains(target) || anchor.contains(target)) return;
    onClose();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onClose();
  };

  const controls = (): HTMLElement[] =>
    Array.from(popover.querySelectorAll<HTMLElement>('button, input, select, textarea, [tabindex]')).filter(
      (item) => !(item as HTMLButtonElement).disabled && item.tabIndex >= 0 && item.getClientRects().length > 0,
    );

  // Tab stays inside the popover once the focus is in it: it is moved here by hand, because Safari skips buttons.
  const handlePopoverKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || event.defaultPrevented) return;
    const items = controls();
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const step = event.shiftKey ? -1 : 1;
    const next =
      index === -1 ? (event.shiftKey ? items[items.length - 1] : items[0]) : items[(index + step + items.length) % items.length];
    event.preventDefault();
    next.focus();
  };

  if (initialFocus !== undefined || label) {
    if (label) {
      if (!popover.getAttribute('role')) popover.setAttribute('role', 'dialog');
      if (!popover.getAttribute('aria-label')) popover.setAttribute('aria-label', label);
    }
    popover.addEventListener('keydown', handlePopoverKeydown);
  }

  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('scroll', handleViewportChange, true);
  document.addEventListener('keydown', handleKeydown);

  // Defer outside-click registration to avoid immediate close on opening click.
  const rafId = window.requestAnimationFrame(() => {
    document.addEventListener('mousedown', handleOutsideClick, true);
  });

  reposition();

  // Not at once: when the popover is opened with Enter, the rest of that key press would go to the control that now
  // has the focus (and click it).
  let focusTimer: number | undefined;
  const takeFocus = (attempt: number) => {
    if (!popover.isConnected) return;
    const target = (initialFocus ? popover.querySelector<HTMLElement>(initialFocus) : null) ?? controls()[0];
    target?.focus({ preventScroll: true });
    // Something else may be handing the focus back to the editor while the command that opened this finishes: try
    // again a few times rather than leave a keyboard user outside the popover.
    if (target && !popover.contains(document.activeElement) && attempt < 4) {
      focusTimer = window.setTimeout(() => takeFocus(attempt + 1), 40);
    }
  };
  if (initialFocus !== undefined) focusTimer = window.setTimeout(() => takeFocus(0), 0);

  const destroy = () => {
    window.clearTimeout(focusTimer);
    popover.removeEventListener('keydown', handlePopoverKeydown);
    window.cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleViewportChange);
    window.removeEventListener('scroll', handleViewportChange, true);
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mousedown', handleOutsideClick, true);
  };

  return { reposition, destroy };
}
