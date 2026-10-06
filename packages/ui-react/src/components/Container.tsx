import React from 'react';

import '@editora/ui-core/container';
import { createUIElement } from './_internals';

type Props = React.HTMLAttributes<HTMLElement> & { size?: 'sm'|'md'|'lg'|'xl' };

export const Container = React.forwardRef<HTMLElement, Props>(function Container(props, forwardedRef) {
  const { children, size = 'md', ...rest } = props as any;
  return createUIElement('ui-container', { ref: forwardedRef, size, ...rest }, children);
});

Container.displayName = 'Container';

export default Container;
