import React from 'react';

import '@editora/ui-core/anchor';
export type AnchorProps = React.AnchorHTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export const Anchor = React.forwardRef<HTMLElement, AnchorProps>(function Anchor(
  { children, ...rest },
  forwardedRef
) {
  return React.createElement('ui-anchor', { ref: forwardedRef, ...rest }, children);
});

Anchor.displayName = 'Anchor';

export default Anchor;
