import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { anchorId?: string; open?: boolean };

export function FloatingToolbar(props: Props) {
  const { children, anchorId, open, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && anchorId) {
      (el as any).showForAnchorId && (el as any).showForAnchorId(anchorId);
    } else {
      (el as any).hide && (el as any).hide();
    }
  }, [open, anchorId]);
  return React.createElement('ui-floating-toolbar', { ref, ...rest }, children);
}

export default FloatingToolbar;
