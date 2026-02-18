import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export function Menu(props: Props & { onSelect?: (idx: number) => void }) {
  const { children, onSelect, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = (e: any) => onSelect && onSelect(e.detail?.index);
    el.addEventListener('select', h as EventListener);
    return () => el.removeEventListener('select', h as EventListener);
  }, [onSelect]);
  return React.createElement('ui-menu', { ref, ...rest }, children);
}

export default Menu;
