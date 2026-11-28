import { createCleanup, firstEnabled, lastEnabled, nextEnabled } from './shared';

export interface ToolbarOptions {
  root: HTMLElement;
  orientation?: 'horizontal' | 'vertical';
  /** Wrap from the last control to the first (default true). */
  loop?: boolean;
}

export interface ToolbarController {
  refresh(): void;
  destroy(): void;
}

const CONTROLS = 'button, [role="button"], a[href], input:not([type="hidden"]), select, [data-toolbar-item]';

/**
 * Toolbar behaviour (WAI-ARIA toolbar pattern): role="toolbar", one tab stop, arrow keys (Left/Right,
 * or Up/Down when vertical; RTL aware) and Home/End move between its controls. In a text input the
 * arrows keep moving the caret. Disabled controls stay reachable (`aria-disabled`), as the pattern
 * recommends, unless they are natively disabled.
 */
export function createToolbar(options: ToolbarOptions): ToolbarController {
  const { root } = options;
  const cleanup = createCleanup();
  let controls: HTMLElement[] = [];
  let current = 0;

  const read = () => {
    controls = Array.from(root.querySelectorAll<HTMLElement>(CONTROLS)).filter((el) => !(el as HTMLButtonElement).disabled);
    root.setAttribute('role', 'toolbar');
    root.setAttribute('aria-orientation', options.orientation === 'vertical' ? 'vertical' : 'horizontal');
    current = Math.min(Math.max(0, current), Math.max(0, controls.length - 1));
    controls.forEach((el, index) => (el.tabIndex = index === current ? 0 : -1));
  };

  cleanup.listen(root, 'focusin', (event: FocusEvent) => {
    const index = controls.indexOf(event.target as HTMLElement);
    if (index >= 0 && index !== current) {
      controls[current].tabIndex = -1;
      current = index;
      controls[current].tabIndex = 0;
    }
  });
  cleanup.listen(root, 'keydown', (event: KeyboardEvent) => {
    const origin = event.target as HTMLElement;
    const index = controls.indexOf(origin);
    if (index < 0) return;
    if (origin.matches('input, textarea, select') && (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Home' || event.key === 'End')) return;
    const vertical = options.orientation === 'vertical';
    const rtl = getComputedStyle(root).direction === 'rtl';
    const next = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const prev = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    let target = -1;
    const all = controls.map((el) => el);
    if (event.key === next) target = nextEnabled(all, index, 1, options.loop !== false);
    else if (event.key === prev) target = nextEnabled(all, index, -1, options.loop !== false);
    else if (event.key === 'Home') target = firstEnabled(all);
    else if (event.key === 'End') target = lastEnabled(all);
    else return;
    event.preventDefault();
    if (target >= 0) controls[target].focus();
  });

  read();
  return {
    refresh: read,
    destroy: () => cleanup.run(),
  };
}
