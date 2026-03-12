import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export type CommandPaletteSelectDetail = {
  index: number;
  item: HTMLElement;
  label: string;
  value?: string;
};

export type CommandPaletteQueryChangeDetail = {
  value: string;
  previousValue?: string;
};

export type CommandPaletteOpenChangeDetail = {
  open: boolean;
};

export type CommandPaletteElement = HTMLElement & {
  openPalette: () => void;
  closePalette: () => void;
  focusSearch: () => void;
  clearQuery: () => void;
  query: string;
};

export type CommandPaletteProps = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> & {
  open?: boolean;
  query?: string;
  placeholder?: string;
  emptyText?: string;
  headless?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (detail: CommandPaletteOpenChangeDetail) => void;
  onSelect?: (detail: CommandPaletteSelectDetail) => void;
  onQueryChange?: (detail: CommandPaletteQueryChangeDetail) => void;
};

export const CommandPalette = React.forwardRef<CommandPaletteElement, CommandPaletteProps>(function CommandPalette(
  { children, open, query, placeholder, emptyText, headless, onOpen, onClose, onOpenChange, onSelect, onQueryChange, ...rest },
  forwardedRef
) {
  const ref = React.useRef<CommandPaletteElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as CommandPaletteElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-command-palette', 'CommandPalette');
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<CommandPaletteSelectDetail>).detail;
      if (detail) onSelect?.(detail);
    };

    const handleQueryChange = (event: Event) => {
      const detail = (event as CustomEvent<CommandPaletteQueryChangeDetail>).detail;
      if (detail) onQueryChange?.(detail);
    };

    const handleOpen = () => {
      onOpen?.();
      onOpenChange?.({ open: true });
    };

    const handleClose = () => {
      onClose?.();
      onOpenChange?.({ open: false });
    };

    el.addEventListener('select', handleSelect as EventListener);
    el.addEventListener('query-change', handleQueryChange as EventListener);
    el.addEventListener('open', handleOpen as EventListener);
    el.addEventListener('close', handleClose as EventListener);

    return () => {
      el.removeEventListener('select', handleSelect as EventListener);
      el.removeEventListener('query-change', handleQueryChange as EventListener);
      el.removeEventListener('open', handleOpen as EventListener);
      el.removeEventListener('close', handleClose as EventListener);
    };
  }, [onClose, onOpen, onOpenChange, onQueryChange, onSelect]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null, enabled = true) => {
      if (!enabled) return;
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    if (typeof open === 'boolean') syncAttr('open', open ? '' : null);
    syncAttr('placeholder', placeholder ?? null, placeholder !== undefined);
    syncAttr('empty-text', emptyText ?? null, emptyText !== undefined);
    if (typeof query === 'string' && el.query !== query) {
      el.query = query;
    }
    if (typeof headless === 'boolean') syncAttr('headless', headless ? '' : null);
  }, [open, placeholder, emptyText, query, headless]);

  return React.createElement('ui-command-palette', { ref, ...rest }, children);
});

CommandPalette.displayName = 'CommandPalette';

export default CommandPalette;
