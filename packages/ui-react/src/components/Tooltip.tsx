import React from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode; text?: string };

export function Tooltip(props: Props & { text?: string }) {
  const { children, text, ...rest } = props as any;
  return React.createElement('ui-tooltip', { text, ...rest }, children);
}

export default Tooltip;
