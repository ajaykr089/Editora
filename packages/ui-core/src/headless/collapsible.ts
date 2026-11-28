import { createCleanup, ensureId, isDisabled, setState } from './shared';

export interface CollapsibleOptions {
  trigger: HTMLElement;
  content: HTMLElement;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface CollapsibleController {
  readonly isOpen: boolean;
  setOpen(open: boolean): void;
  toggle(): void;
  destroy(): void;
}

/**
 * Disclosure behaviour (WAI-ARIA disclosure pattern): the trigger toggles the content, with
 * aria-expanded and aria-controls; the content is `hidden` when closed. `data-state` is "open" or
 * "closed" on both, `data-disabled` on a disabled trigger.
 */
export function createCollapsible(options: CollapsibleOptions): CollapsibleController {
  const { trigger, content } = options;
  const cleanup = createCleanup();
  let isOpen = !!options.defaultOpen;

  trigger.setAttribute('aria-controls', ensureId(content, 'ui-collapsible'));
  if (options.disabled) {
    trigger.setAttribute('aria-disabled', 'true');
    trigger.setAttribute('data-disabled', '');
  }

  const sync = () => {
    trigger.setAttribute('aria-expanded', String(isOpen));
    content.hidden = !isOpen;
    setState(isOpen ? 'open' : 'closed', trigger, content);
  };

  const setOpen = (next: boolean) => {
    if (next === isOpen) return;
    isOpen = next;
    sync();
    options.onOpenChange?.(isOpen);
  };

  cleanup.listen(trigger, 'click', (event: MouseEvent) => {
    if (isDisabled(trigger)) return;
    event.preventDefault();
    setOpen(!isOpen);
  });
  sync();

  return {
    get isOpen() {
      return isOpen;
    },
    setOpen,
    toggle: () => setOpen(!isOpen),
    destroy: () => cleanup.run(),
  };
}
