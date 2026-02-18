import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { open?: boolean; onSelect?: (idx: number) => void };

export function CommandPalette(props: Props) {
  const { children, open, onSelect, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: any) => onSelect && onSelect(e.detail?.index);
    el.addEventListener('select', handler as EventListener);
    if (open) el.setAttribute('open',''); else el.removeAttribute('open');
    return () => el.removeEventListener('select', handler as EventListener);
  }, [open, onSelect]);
  return React.createElement('ui-command-palette', { ref, ...rest }, children);
}

export default CommandPalette;
