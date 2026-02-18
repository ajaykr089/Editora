import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export function Modal(props: Props & { open?: boolean; onOpen?: () => void; onClose?: () => void }) {
  const { children, open, onOpen, onClose, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleOpen = () => onOpen && onOpen();
    const handleClose = () => onClose && onClose();
    el.addEventListener('open', handleOpen as EventListener);
    el.addEventListener('close', handleClose as EventListener);
    return () => {
      el.removeEventListener('open', handleOpen as EventListener);
      el.removeEventListener('close', handleClose as EventListener);
    };
  }, [onOpen, onClose]);

  return React.createElement('ui-modal', { ref, open: open ? '' : undefined, ...rest }, children);
}

export default Modal;
