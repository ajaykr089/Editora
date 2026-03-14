import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { warnIfElementNotRegistered } from './_internals';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type CommandSelectDetail = {
  index: number;
  item: HTMLElement;
  label: string;
  value?: string;
};

type CommandProps = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> & {
  placeholder?: string;
  emptyText?: string;
  onSelect?: (detail: CommandSelectDetail) => void;
  onQueryChange?: (value: string) => void;
};

export const Command = React.forwardRef<HTMLElement, CommandProps>(function Command(
  { placeholder, emptyText, children, onSelect, onQueryChange, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    warnIfElementNotRegistered('ui-command', 'Command');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<CommandSelectDetail>).detail;
      if (detail) onSelect?.(detail);
    };

    const handleQueryChange = (event: Event) => {
      const detail = (event as CustomEvent<{ value?: string }>).detail;
      if (typeof detail?.value === 'string') onQueryChange?.(detail.value);
    };

    el.addEventListener('select', handleSelect as EventListener);
    el.addEventListener('query-change', handleQueryChange as EventListener);
    return () => {
      el.removeEventListener('select', handleSelect as EventListener);
      el.removeEventListener('query-change', handleQueryChange as EventListener);
    };
  }, [onQueryChange, onSelect]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    syncAttr('placeholder', placeholder ?? null);
    syncAttr('empty-text', emptyText ?? null);
  }, [emptyText, placeholder]);

  return React.createElement('ui-command', { ref, ...rest }, children);
});

Command.displayName = 'Command';

export default Command;
