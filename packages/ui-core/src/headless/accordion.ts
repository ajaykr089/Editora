import { createCleanup, ensureId, firstEnabled, isDisabled, lastEnabled, nextEnabled, setState } from './shared';

export interface AccordionOptions {
  /** Contains items `[data-accordion-item]`, each with a `[data-accordion-trigger]` and `[data-accordion-content]`. */
  root: HTMLElement;
  /** single: one item open at a time (default); multiple: any number. */
  type?: 'single' | 'multiple';
  /** single only: the open item can be closed again (default true). */
  collapsible?: boolean;
  /** Open item values (`data-value` on the item, else its index). */
  defaultValue?: string[];
  orientation?: 'vertical' | 'horizontal';
  onValueChange?: (value: string[]) => void;
}

export interface AccordionController {
  readonly value: string[];
  setValue(value: string[]): void;
  refresh(): void;
  destroy(): void;
}

/**
 * Accordion behaviour (WAI-ARIA accordion pattern): each trigger is a button with aria-expanded and
 * aria-controls, each panel a region labelled by its trigger; Arrow Up/Down (Left/Right when
 * horizontal), Home and End move between triggers. `data-state` "open" / "closed" on items,
 * triggers and panels.
 */
export function createAccordion(options: AccordionOptions): AccordionController {
  const { root } = options;
  const cleanup = createCleanup();
  const multiple = options.type === 'multiple';
  const collapsible = options.collapsible !== false;
  let items: HTMLElement[] = [];
  let triggers: HTMLElement[] = [];
  let panels: HTMLElement[] = [];
  let open = new Set<string>(options.defaultValue || []);

  const valueOf = (item: HTMLElement, index: number) => item.getAttribute('data-value') || String(index);

  const read = () => {
    items = Array.from(root.querySelectorAll<HTMLElement>('[data-accordion-item]')).filter((item) => item.closest('[data-accordion-item]') === item && item.parentElement && root.contains(item));
    triggers = items.map((item) => item.querySelector<HTMLElement>('[data-accordion-trigger]')!).filter(Boolean);
    panels = items.map((item) => item.querySelector<HTMLElement>('[data-accordion-content]')!).filter(Boolean);
    items.forEach((_item, index) => {
      const trigger = triggers[index];
      const panel = panels[index];
      if (!trigger || !panel) return;
      const triggerId = ensureId(trigger, 'ui-accordion-trigger');
      trigger.setAttribute('aria-controls', ensureId(panel, `${triggerId}-panel`));
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', triggerId);
    });
    if (!multiple && open.size > 1) open = new Set([...open].slice(0, 1));
  };

  const sync = () => {
    items.forEach((item, index) => {
      const isOpen = open.has(valueOf(item, index));
      const trigger = triggers[index];
      const panel = panels[index];
      setState(isOpen ? 'open' : 'closed', item, trigger, panel);
      trigger?.setAttribute('aria-expanded', String(isOpen));
      // A single, non-collapsible accordion's open trigger cannot close it: say so.
      if (trigger && !multiple && !collapsible) trigger.setAttribute('aria-disabled', String(isOpen));
      if (panel) panel.hidden = !isOpen;
    });
  };

  const toggle = (index: number) => {
    const trigger = triggers[index];
    if (!trigger || (isDisabled(trigger) && !(trigger.getAttribute('aria-disabled') === 'true' && !multiple && !collapsible))) return;
    const value = valueOf(items[index], index);
    if (open.has(value)) {
      if (!multiple && !collapsible) return;
      open.delete(value);
    } else {
      if (!multiple) open.clear();
      open.add(value);
    }
    sync();
    options.onValueChange?.([...open]);
  };

  cleanup.listen(root, 'click', (event: MouseEvent) => {
    const index = triggers.findIndex((trigger) => trigger.contains(event.target as Node));
    if (index >= 0) {
      event.preventDefault();
      toggle(index);
    }
  });
  cleanup.listen(root, 'keydown', (event: KeyboardEvent) => {
    const index = triggers.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    const horizontal = options.orientation === 'horizontal';
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
    let target = -1;
    if (event.key === nextKey) target = nextEnabled(triggers, index, 1);
    else if (event.key === prevKey) target = nextEnabled(triggers, index, -1);
    else if (event.key === 'Home') target = firstEnabled(triggers);
    else if (event.key === 'End') target = lastEnabled(triggers);
    else return;
    event.preventDefault();
    if (target >= 0) triggers[target].focus();
  });

  read();
  sync();

  return {
    get value() {
      return [...open];
    },
    setValue(value: string[]) {
      open = new Set(multiple ? value : value.slice(0, 1));
      sync();
    },
    refresh() {
      read();
      sync();
    },
    destroy: () => cleanup.run(),
  };
}
