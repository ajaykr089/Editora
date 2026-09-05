import React from 'react';

import '@editora/ui-core/container';
type Props = React.HTMLAttributes<HTMLElement> & { size?: 'sm'|'md'|'lg'|'xl' };

export function Container(props: Props) {
  const { children, size = 'md', ...rest } = props as any;
  return React.createElement('ui-container', { size, ...rest }, children);
}

export default Container;
