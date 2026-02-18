import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export function Input(props: Props & { value?: string; onChange?: (v: string) => void }) {
  const { value, onChange, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: any) => onChange && onChange(e.detail?.value ?? (e.target && e.target.value));
    el.addEventListener('input', handler as EventListener);
    return () => el.removeEventListener('input', handler as EventListener);
  }, [onChange]);
  return React.createElement('ui-input', { ref, value, ...rest });
}

export default Input;
