import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export function Popover(props: Props & { onOpen?: () => void; onClose?: () => void }) {
  const { children, onOpen, onClose, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const hOpen = () => onOpen && onOpen();
    const hClose = () => onClose && onClose();
    el.addEventListener('open', hOpen as EventListener);
    el.addEventListener('close', hClose as EventListener);
    return () => { el.removeEventListener('open', hOpen as EventListener); el.removeEventListener('close', hClose as EventListener); };
  }, [onOpen, onClose]);
  return React.createElement('ui-popover', { ref, ...rest }, children);
}

export default Popover;
