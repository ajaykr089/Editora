import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { open?: boolean; position?: string };

export function PluginPanel(props: Props) {
  const { children, open, position, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) el.setAttribute('open',''); else el.removeAttribute('open');
    if (position) el.setAttribute('position', position);
  }, [open, position]);
  return React.createElement('ui-plugin-panel', { ref, ...rest }, children);
}

export default PluginPanel;
