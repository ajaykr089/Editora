import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { anchorId?: string; open?: boolean };

export function SelectionPopup(props: Props) {
  const { children, anchorId, open, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && anchorId) {
      (el as any).openFor && (el as any).openFor(anchorId);
    } else {
      (el as any).close && (el as any).close();
    }
  }, [open, anchorId]);
  return React.createElement('ui-selection-popup', { ref, ...rest }, children);
}

export default SelectionPopup;
