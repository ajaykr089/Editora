import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export function Tabs(props: Props & { onChange?: (idx: number) => void }) {
  const { children, onChange, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = (e: any) => onChange && onChange(e.detail?.selected);
    el.addEventListener('change', h as EventListener);
    return () => el.removeEventListener('change', h as EventListener);
  }, [onChange]);
  return React.createElement('ui-tabs', { ref, ...rest }, children);
}

export default Tabs;
