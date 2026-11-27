import { createCleanup, ensureId, firstEnabled, isDisabled, lastEnabled, nextEnabled, setState } from './shared';

export interface TabsOptions {
  /** The element around the tabs. */
  tablist: HTMLElement;
  /** Tabs: `[role="tab"]` or `[data-tab]` inside the tablist, by default. */
  tabs?: HTMLElement[];
  /** Panels, in the same order as the tabs, or matched by `data-value`. Default: `[role="tabpanel"]` / `[data-panel]` in `root`. */
  panels?: HTMLElement[];
  /** Where to look for panels (default: the tablist's parent). */
  root?: HTMLElement;
  orientation?: 'horizontal' | 'vertical';
  /** automatic: arrows select as they move; manual: arrows move, Enter or Space selects. */
  activation?: 'automatic' | 'manual';
  /** The selected tab's `data-value` (or index as a string). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface TabsController {
  readonly value: string;
  setValue(value: string): void;
  /** Re-reads tabs and panels (after adding or removing some). */
  refresh(): void;
  destroy(): void;
}

/**
 * Tabs behaviour on your own markup (WAI-ARIA tabs pattern): roles, aria-selected, aria-controls
 * and aria-labelledby, a single tab stop that arrows move (Left/Right, or Up/Down when vertical;
 * RTL aware), Home and End, automatic or manual activation. Unselected panels are `hidden`.
 * Tabs and panels get `data-state` "active" or "inactive".
 */
export function createTabs(options: TabsOptions): TabsController {
  const { tablist } = options;
  const cleanup = createCleanup();
  const vertical = options.orientation === 'vertical';
  let tabs: HTMLElement[] = [];
  let panels: HTMLElement[] = [];
  let value = '';

  const valueOf = (tab: HTMLElement, index: number) => tab.getAttribute('data-value') || String(index);

  const read = () => {
    tabs = options.tabs ? [...options.tabs] : Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"], [data-tab]'));
    const root = options.root || tablist.parentElement || tablist;
    const found = options.panels ? [...options.panels] : Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"], [data-panel]'));
    panels = tabs.map((tab, index) => {
      const key = tab.getAttribute('data-value');
      return (key && found.find((panel) => panel.getAttribute('data-value') === key)) || found[index];
    }).filter(Boolean) as HTMLElement[];
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      const tabId = ensureId(tab, 'ui-tab');
      const panel = panels[index];
      if (panel) {
        panel.setAttribute('role', 'tabpanel');
        tab.setAttribute('aria-controls', ensureId(panel, `${tabId}-panel`));
        panel.setAttribute('aria-labelledby', tabId);
        // A panel without focusable content must be reachable to read it.
        if (!panel.hasAttribute('tabindex')) panel.tabIndex = 0;
      }
    });
  };

  const sync = () => {
    tabs.forEach((tab, index) => {
      const selected = valueOf(tab, index) === value;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      setState(selected ? 'active' : 'inactive', tab, panels[index]);
      if (panels[index]) panels[index].hidden = !selected;
    });
  };

  const select = (index: number, notify = true) => {
    const tab = tabs[index];
    if (!tab || isDisabled(tab)) return;
    const next = valueOf(tab, index);
    if (next === value) return;
    value = next;
    sync();
    if (notify) options.onValueChange?.(value);
  };

  cleanup.listen(tablist, 'click', (event: MouseEvent) => {
    const index = tabs.findIndex((tab) => tab.contains(event.target as Node));
    if (index >= 0) select(index);
  });
  cleanup.listen(tablist, 'keydown', (event: KeyboardEvent) => {
    const index = tabs.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    const rtl = getComputedStyle(tablist).direction === 'rtl';
    const prev = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    const next = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    let target = -1;
    if (event.key === next) target = nextEnabled(tabs, index, 1);
    else if (event.key === prev) target = nextEnabled(tabs, index, -1);
    else if (event.key === 'Home') target = firstEnabled(tabs);
    else if (event.key === 'End') target = lastEnabled(tabs);
    else if ((event.key === 'Enter' || event.key === ' ') && options.activation === 'manual') {
      event.preventDefault();
      select(index);
      return;
    } else return;
    event.preventDefault();
    if (target < 0) return;
    if (options.activation === 'manual') {
      tabs.forEach((tab, i) => (tab.tabIndex = i === target ? 0 : -1));
    } else {
      select(target);
    }
    tabs[target].focus();
  });

  read();
  const initial = options.defaultValue ?? (tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ? valueOf(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true')!, tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true')) : null);
  const firstIndex = firstEnabled(tabs);
  value = initial ?? (firstIndex >= 0 ? valueOf(tabs[firstIndex], firstIndex) : '');
  sync();

  return {
    get value() {
      return value;
    },
    setValue(next: string) {
      const index = tabs.findIndex((tab, i) => valueOf(tab, i) === next);
      if (index >= 0) select(index, false);
    },
    refresh() {
      read();
      sync();
    },
    destroy: () => cleanup.run(),
  };
}
