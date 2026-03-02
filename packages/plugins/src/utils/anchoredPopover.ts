export interface AnchoredPopoverOptions {
  popover: HTMLElement;
  anchor: HTMLElement;
  onClose: () => void;
  gap?: number;
  margin?: number;
  zIndex?: number;
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

  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('scroll', handleViewportChange, true);
  document.addEventListener('keydown', handleKeydown);

  // Defer outside-click registration to avoid immediate close on opening click.
  const rafId = window.requestAnimationFrame(() => {
    document.addEventListener('mousedown', handleOutsideClick, true);
  });

  reposition();

  const destroy = () => {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleViewportChange);
    window.removeEventListener('scroll', handleViewportChange, true);
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mousedown', handleOutsideClick, true);
  };

  return { reposition, destroy };
}
