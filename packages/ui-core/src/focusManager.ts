export const FocusManager = {
  trap(container: HTMLElement) {
    const FOCUSABLE = 'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
    const previouslyFocused = document.activeElement as HTMLElement | null;
    let first = focusable[0];
    let last = focusable[focusable.length - 1];
    function handleKey(e: KeyboardEvent) {
      // Only handle when focus is inside container
      const active = document.activeElement as HTMLElement | null;
      if (!active || !container.contains(active)) return;
      if (e.key === 'Tab') {
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            (last || first).focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            (first || last).focus();
          }
        }
      } else if (e.key === 'Escape') {
        // allow host to close on Escape by dispatching event
        (container as any).dispatchEvent(new CustomEvent('escape'));
      }
    }
    function focusFirst() {
      try { (first || container).focus(); } catch (e) {}
    }
    document.addEventListener('keydown', handleKey);
    focusFirst();
    return {
      release() {
        document.removeEventListener('keydown', handleKey);
        try { if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus(); } catch (e) {}
      }
    };
  }
};
