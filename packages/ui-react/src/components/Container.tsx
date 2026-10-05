import React from 'react';

import '@editora/ui-core/container';
import { createUIElement } from './_internals';

type Props = React.HTMLAttributes<HTMLElement> & { size?: 'sm'|'md'|'lg'|'xl' };

export function Container(props: Props) {
  const { children, size = 'md', ...rest } = props as any;
  return createUIElement('ui-container', { size, ...rest }, children);
}

export default Container;
