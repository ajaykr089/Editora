export const FocusManager = {
  trap(container: HTMLElement) {
    const FOCUSABLE = 'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
    const activeTraps = ((FocusManager as any).__activeTraps ||= []) as Array<{ id: symbol }>;
    const trapId = Symbol('focus-trap');
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function getFocusable() {
      return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter((node) => !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true');
    }

    function isTopTrap() {
      return activeTraps.length > 0 && activeTraps[activeTraps.length - 1]?.id === trapId;
    }

    function focusFirst() {
      const focusable = getFocusable();
      const auto = focusable.find((node) => node.hasAttribute('autofocus'));
      const target = auto || focusable[0] || container;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      try { target.focus(); } catch (e) {}
    }

    function handleKey(e: KeyboardEvent) {
      if (!isTopTrap()) return;
      // Only handle when focus is inside container
      const active = document.activeElement as HTMLElement | null;
      if (!active || !container.contains(active)) return;
      if (e.key === 'Tab') {
        const focusable = getFocusable();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (focusable.length === 0) {
          e.preventDefault();
          focusFirst();
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

    function handleFocusIn(event: FocusEvent) {
      if (!isTopTrap()) return;
      const target = event.target as Node | null;
      if (target && !container.contains(target)) {
        focusFirst();
      }
    }

    activeTraps.push({ id: trapId });
    document.addEventListener('keydown', handleKey);
    document.addEventListener('focusin', handleFocusIn, true);
    focusFirst();

    return {
      release() {
        const index = activeTraps.findIndex((entry) => entry.id === trapId);
        if (index >= 0) activeTraps.splice(index, 1);
        document.removeEventListener('keydown', handleKey);
        document.removeEventListener('focusin', handleFocusIn, true);
        try { if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus(); } catch (e) {}
      }
    };
  }
};
