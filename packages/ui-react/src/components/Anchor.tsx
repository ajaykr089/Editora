import React from 'react';

import '@editora/ui-core/anchor';
import { createUIElement } from './_internals';

export type AnchorProps = React.AnchorHTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export const Anchor = React.forwardRef<HTMLElement, AnchorProps>(function Anchor(
  { children, ...rest },
  forwardedRef
) {
  return createUIElement('ui-anchor', { ref: forwardedRef, ...rest }, children);
});

Anchor.displayName = 'Anchor';

export default Anchor;
